const express = require('express');
const router = express.Router();
const claudeService = require('../services/claudeService');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 대화 전송
router.post('/', async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message required' });
    }

    const response = await claudeService.chat(userId, message);

    const io = req.app.get('io');
    io.to(`user_${userId}`).emit('new_message', {
      from: 'agent',
      message: response,
      timestamp: new Date()
    });

    res.json({ 
      success: true,
      message: response 
    });
  } catch (error) {
    console.error('Conversation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 대화 히스토리 조회
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { category } = req.query;

    const where = { userId };
    if (category) {
      where.category = category;
    }

    const conversations = await prisma.conversation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const grouped = conversations.reduce((acc, conv) => {
      const cat = conv.category || '기타';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(conv);
      return acc;
    }, {});

    res.json({ 
      success: true,
      conversations: grouped 
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
