/*
  Warnings:

  - You are about to alter the column `AULA_Data` on the `Aula` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Aula` MODIFY `AULA_Data` DATETIME NOT NULL;
