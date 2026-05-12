import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
const router = Router();

router.get('/', async (req, res) => {
  try {
    const servicos = await prisma.servico.findMany({
      orderBy: { id: 'asc' },
    });
    res.json(servicos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
});

export default router;