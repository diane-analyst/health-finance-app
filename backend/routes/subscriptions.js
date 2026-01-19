const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 적립 시작
router.post('/', async (req, res) => {
  try {
    const { userId, monthlyAmount } = req.body;

    const estimatedMedicalCost = 28000000;
    const coverageRatio = monthlyAmount / 100000;
    const coverageAmount = estimatedMedicalCost * (coverageRatio / 10);

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        monthlyAmount,
        coverageAmount: Math.floor(coverageAmount),
        coverageRatio: coverageRatio / 10,
        status: 'active'
      }
    });

    res.json({ 
      success: true,
      subscription 
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 적립 현황 조회
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const subscriptions = await prisma.subscription.findMany({
      where: { 
        userId,
        status: 'active'
      },
      orderBy: { startedAt: 'desc' },
    });

    res.json({ 
      success: true,
      subscriptions 
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
