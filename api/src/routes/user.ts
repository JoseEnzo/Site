import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// CADASTRO
router.post("/cadastro", async (req, res) => {
  try {
    const { email, nome, senha, telefone } = req.body;

    const existente = await prisma.user.findFirst({ where: { email } });
    if (existente) {
      return res.status(400).json({ message: "E-mail já cadastrado" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const user = await prisma.user.create({
      data: { email, nome, senha: senhaCriptografada, telefone },
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
    const { senha: _, ...usuarioSemSenha } = user;
    res
      .status(201)
      .json({
        message: "Usuário criado com sucesso!",
        token,
        usuario: usuarioSemSenha,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha!);
    if (!senhaCorreta) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // ✅ Retorna o usuário sem a senha
    const { senha: _, ...usuarioSemSenha } = user;
    res.json({
      message: "Login realizado com sucesso!",
      token,
      usuario: usuarioSemSenha,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// ALTERAR
router.put("/alterar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, senha, telefone } = req.body;

    const existente = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!existente) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { email, senha: senhaCriptografada, telefone },
    });

    res.json({ message: "Usuário atualizado com sucesso!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// DELETAR
router.delete("/deletar/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existente = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!existente) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await prisma.user.delete({ where: { id: Number(id) } });

    res.json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

export default router;
