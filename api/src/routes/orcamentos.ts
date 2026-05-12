import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { autenticar } from "../middleware/auth.js";

const router = Router();

router.post("/", autenticar, async (req, res) => {
  const { servico, veiculo, descricao, contato } = req.body;
  const userId = (req as any).userId;

  if (!servico || !veiculo || !descricao || !contato) {
    return res.status(400).json({ error: "Preencha todos os campos." });
  }

  try {
    const orcamento = await prisma.orcamento.create({
      data: {
        servico,
        veiculo,
        descricao,
        contato,
        user: {
          connect: { id: Number(userId) },
        },
      },
    });
    res.status(201).json(orcamento);
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar orçamento." });
  }
});
router.delete('/:id', autenticar, async (req, res) => {
  const { id } = req.params
  const userId = (req as any).userId
  try {

    const orcamento = await prisma.orcamento.findUnique({
      where: { id: Number(id) }
    });

    if (!orcamento) {
      return res.status(404).json({ error: 'Orçamento não encontrado.' });
    }

    if (orcamento.userId !== Number(userId)) {
      return res.status(403).json({ error: 'Sem permissão para cancelar este orçamento.' });
    }

    await prisma.orcamento.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Orçamento cancelado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cancelar orçamento.' });
  }
})

export default router;