/*
  Warnings:

  - You are about to drop the `Assinatura` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pagamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plano` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Assinatura` DROP FOREIGN KEY `Assinatura_planoId_fkey`;

-- DropForeignKey
ALTER TABLE `Assinatura` DROP FOREIGN KEY `Assinatura_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `Pagamento` DROP FOREIGN KEY `Pagamento_assinaturaId_fkey`;

-- DropTable
DROP TABLE `Assinatura`;

-- DropTable
DROP TABLE `Pagamento`;

-- DropTable
DROP TABLE `Plano`;

-- CreateTable
CREATE TABLE `Servico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `icone` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Servico_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);
