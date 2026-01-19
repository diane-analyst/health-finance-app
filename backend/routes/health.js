const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 건강 데이터 입력
router.post('/records', async (req, res) => {
  try {
    const { 
      userId, 
      bloodPressureSys, 
      bloodPressureDia, 
      bloodSugar, 
      weight 
    } = req.body;

    const record = await prisma.healthRecord.create({
      data: {
        userId,
        recordType: 'daily',
        bloodPressureSys: bloodPressureSys ? parseInt(bloodPressureSys) : null,
        bloodPressureDia: bloodPressureDia ? parseInt(bloodPressureDia) : null,
        bloodSugar: bloodSugar ? parseInt(bloodSugar) : null,
        weight: weight ? parseFloat(weight) : null,
      }
    });

    res.json({ 
      success: true,
      record 
    });
  } catch (error) {
    console.error('Health record error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 건강 기록 조회
router.get('/records/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 30 } = req.query;

    const records = await prisma.healthRecord.findMany({
      where: { userId },
      orderBy: { recordedAt: 'desc' },
      take: parseInt(limit),
    });

    res.json({ 
      success: true,
      records 
    });
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 건강 리스크 분석
router.get('/analysis/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const recentRecords = await prisma.healthRecord.findMany({
      where: { userId, recordType: 'daily' },
      orderBy: { recordedAt: 'desc' },
      take: 30,
    });

    const analysis = {
      bloodPressure: analyzeBloodPressure(recentRecords),
      trend: analyzeTrend(recentRecords),
      recommendations: []
    };

    if (analysis.bloodPressure.status === 'high') {
      analysis.recommendations.push('혈압이 높습니다. AI 닥터 상담을 권장합니다.');
    }

    res.json({ 
      success: true,
      analysis 
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

function analyzeBloodPressure(records) {
  if (records.length === 0) return { status: 'unknown' };

  const avgSys = records
    .filter(r => r.bloodPressureSys)
    .reduce((sum, r) => sum + r.bloodPressureSys, 0) / records.length;

  if (avgSys >= 140) return { status: 'high', average: avgSys };
  if (avgSys >= 120) return { status: 'elevated', average: avgSys };
  return { status: 'normal', average: avgSys };
}

function analyzeTrend(records) {
  if (records.length < 14) return 'insufficient_data';

  const recent = records.slice(0, 7);
  const previous = records.slice(7, 14);

  const recentAvg = recent.reduce((sum, r) => sum + (r.bloodPressureSys || 0), 0) / 7;
  const previousAvg = previous.reduce((sum, r) => sum + (r.bloodPressureSys || 0), 0) / 7;

  if (recentAvg > previousAvg + 5) return 'increasing';
  if (recentAvg < previousAvg - 5) return 'decreasing';
  return 'stable';
}

module.exports = router;
