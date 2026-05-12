import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number}
    (req as any).userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido' })
  }
}