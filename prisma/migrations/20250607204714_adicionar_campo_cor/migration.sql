/*
  Warnings:

  - You are about to alter the column `AULA_Data` on the `Aula` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Aula` MODIFY `AULA_Data` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `Modalidade` ADD COLUMN `MODL_Cor` VARCHAR(7) NOT NULL DEFAULT '#FF007F';
