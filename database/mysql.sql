CREATE DATABASE `SistemaVagasEstagio`;

USE `SistemaVagasEstagio`;

CREATE TABLE `usuarios` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(60) NOT NULL,
    `email` VARCHAR(60) UNIQUE NOT NULL,
    `pswd` VARCHAR(32) NOT NULL,
    `telefone` VARCHAR(13) NOT NULL,
    `criadoEm` DATETIME DEFAULT NOW(),
    `excluidoEm` DATETIME DEFAULT NULL,
    `tipo` ENUM('aluno','empresa') NOT NULL,
    PRIMARY KEY(id)
) DEFAULT character set utf8;
-- Criar usuários Default:
INSERT INTO `usuarios`(`nome`, `email`, `pswd`, `tipo`) VALUES
  ('Aluno Primeiro','aluno1@localhost.com.br',MD5('Teste53!'),'aluno'),
  ('Aluno Segundo','aluno2@localhost.com.br',MD5('Teste53!'),'aluno'),
  ('Empresa Primeira','empresa1@localhost.com.br',MD5('Teste53!'),'empresa'),
  ('Empresa Segunda','empresa2@localhost.com.br',MD5('Teste53!'),'empresa');


CREATE TABLE `areas` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(60) UNIQUE NOT NULL,
    PRIMARY KEY(`id`)
) DEFAULT character set utf8;
-- criar áreas default
INSERT INTO `areas` VALUES
    (1, 'Técnico de Informática'),
    (2, 'Eletrotécnico'),
    (3, 'Montador de Móveis'),
    (4, 'Desenvolvedor FullStack');


CREATE TABLE `vagas`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(60) NOT NULL,
    `descricao` VARCHAR(1000) NOT NULL,
    `areaId` INT NOT NULL,
    `empresaId` INT NOT NULL,
    `turno` ENUM('integral','manha','tarde','noite') NOT NULL,
    `modalidade` ENUM('presencial','remoto','hibrido') NOT NULL,
    `local` VARCHAR(60) DEFAULT NULL,
    `contatoNome` VARCHAR(60) DEFAULT NULL, -- se for null, pega do criador
    `contatoTelefone` VARCHAR(13) DEFAULT NULL, -- se for null, pega do criador
    `contatoEmail` VARCHAR(60) DEFAULT NULL, -- se for null, pega do criador
    `criadoEm` DATETIME DEFAULT NOW(),
    `excluidoEm` DATETIME DEFAULT NULL,
    FOREIGN KEY(`empresaId`) REFERENCES `usuarios`(`id`),
    FOREIGN KEY(`areaId`) REFERENCES `areas`(`id`),
    PRIMARY KEY(`id`)
) DEFAULT character set utf8;
-- Criar vagas de Exemplo
INSERT INTO `vagas`(`titulo`,`descricao`,`areaId`,`empresaId`,`local`,`contatoNome`,`contatoTelefone`,`contatoEmail`,`turno`,`modalidade`) VALUES
    ('Estágio em TI','Manutenção de computadores',1,3,'Bom Princípio','Pessoa A','5551999999999','rh@empresa1.com.br','integral','presencial'),
    ('Trabalho B','Manutenção de computadores',1,4,'Feliz','Pessoa B','5551999999999','rh@empresa1.com.br','integral','presencial');


CREATE TABLE `usuario_area`(
    `usuarioId` INT NOT NULL,
    `areaId` INT NOT NULL,
    FOREIGN KEY(`usuarioId`) REFERENCES `usuarios`(`id`),
    FOREIGN KEY(`areaId`) REFERENCES `areas`(`id`),
    PRIMARY KEY(`usuarioId`,`areaId`)
) DEFAULT character set utf8;