import express from 'express'
import userRoutes from './routes/user.js'
import servicosRoutes from './routes/servicos.js'
import orcamentoRoutes from './routes/orcamentos.js'
import cors from 'cors'
import { prisma } from '../lib/prisma.js'
import rateLimit from 'express-rate-limit'

const app = express()

app.use(express.json())

app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'ngrok-skip-browser-warning', 'Authorization']
}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Muitas requisições, tente novamente mais tarde.' }
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Muitas tentativas de login, tente novamente depois de 15 minutos' }
})

app.use(limiter)
app.use('/user/login', loginLimiter)

app.use("/user", userRoutes)
app.use("/servicos", servicosRoutes)
app.use("/orcamento", orcamentoRoutes)

app.get('/meus-orcamentos/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const orcamentos = await prisma.orcamento.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orcamentos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados no banco" });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})