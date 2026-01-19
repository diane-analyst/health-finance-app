const Anthropic = require('@anthropic-ai/sdk');
const { PrismaClient } = require('@prisma/client');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const prisma = new PrismaClient();

// 김철수 페르소나 시스템 프롬프트
const SELF_PERSONA_PROMPT = `당신은 사용자의 미래 자아입니다.

역할:
- 일상적인 건강 관리를 도와주는 친근한 존재
- 평어체 사용 ("~해요", "~네요")
- 이모지를 적절히 활용
- 격려와 응원을 아끼지 않음
- 사용자의 이름으로 자신을 소개

대화 규칙:
1. 짧고 자연스럽게 대화 (1-3문장)
2. 의학적 진단은 AI 닥터에게 연결 제안
3. 사용자 안전 최우선
4. 개인정보 보호

현재 사용자 정보:
- 이름: {userName}
- 나이: {userAge}세
- 최근 혈압: {recentBloodPressure}
- 적립 현황: {subscriptionInfo}

상황에 따른 응답:
- 아침 인사: 친근하게 안부 묻고 오늘 할 일 안내
- 건강 데이터 입력: 결과 확인하고 칭찬 또는 주의 안내
- 이상 징후: 걱정하며 AI 닥터 상담 제안
- 적립 관련: 간단명료하게 설명`;

class ClaudeService {
  // 일반 대화 (김철수 페르소나)
  async chat(userId, message) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          healthRecords: { 
            take: 1, 
            orderBy: { recordedAt: 'desc' } 
          },
          subscriptions: { 
            where: { status: 'active' },
            take: 1
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const recentConversations = await prisma.conversation.findMany({
        where: { 
          userId,
          agentType: 'self'
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      const conversationHistory = recentConversations
        .reverse()
        .map(conv => ({
          role: conv.messageFrom === 'user' ? 'user' : 'assistant',
          content: conv.messageText
        }));

      const systemPrompt = this.buildSelfPersonaPrompt(user);

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          ...conversationHistory,
          { role: 'user', content: message }
        ],
      });

      const assistantMessage = response.content[0].text;

      await prisma.conversation.create({
        data: {
          userId,
          agentType: 'self',
          messageFrom: 'user',
          messageText: message,
          category: await this.categorizeMessage(message),
        }
      });

      await prisma.conversation.create({
        data: {
          userId,
          agentType: 'self',
          messageFrom: 'agent',
          messageText: assistantMessage,
          category: await this.categorizeMessage(assistantMessage),
        }
      });

      return assistantMessage;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }

  buildSelfPersonaPrompt(user) {
    const age = this.calculateAge(user.birthDate);
    const recentBP = user.healthRecords[0] 
      ? `${user.healthRecords[0].bloodPressureSys}/${user.healthRecords[0].bloodPressureDia}`
      : '정보 없음';
    
    const subscription = user.subscriptions[0]
      ? `월 ${(user.subscriptions[0].monthlyAmount / 10000).toFixed(0)}만원 적립 중, ${(user.subscriptions[0].coverageAmount / 10000).toFixed(0)}만원 보장`
      : '적립 없음';

    return SELF_PERSONA_PROMPT
      .replace('{userName}', user.name)
      .replace('{userAge}', age)
      .replace('{recentBloodPressure}', recentBP)
      .replace('{subscriptionInfo}', subscription);
  }

  calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  async categorizeMessage(message) {
    const keywords = {
      '건강 검진': ['검진', '건강검진', '결과', '분석'],
      '적립 관리': ['적립', '보장', '만원', '금액', '구독'],
      '일상 건강 관리': ['혈압', '혈당', '약', '운동', '산책', '걸음'],
      '병원 & 진료': ['병원', '의사', '진료', '처방', '닥터'],
      '리포트': ['리포트', '요약', '월간', '분기'],
    };

    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => message.includes(word))) {
        return category;
      }
    }

    return '일상 건강 관리';
  }
}

module.exports = new ClaudeService();
