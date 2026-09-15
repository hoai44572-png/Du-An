-- Script tao database swift_coffee_db
-- Chay script nay trong phpMyAdmin hoac MySQL Workbench neu chua co database

CREATE DATABASE IF NOT EXISTS swift_coffee_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Kiem tra database da duoc tao
SELECT SCHEMA_NAME, DEFAULT_CHARACTER_SET_NAME
FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME = 'swift_coffee_db';
