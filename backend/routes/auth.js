const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { name, phone, birthDate } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        birthDate: new Date(birthDate),
      }
    });

    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ 
      success: true,
      user,
      token 
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await prisma.user.findUnique({
      where: { phone }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ 
      success: true,
      user,
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
