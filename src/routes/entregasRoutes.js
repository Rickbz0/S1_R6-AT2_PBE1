const express = require("express");
const router = express.Router();
const { entregasController } = require("../controllers/entregasController");
const e = require("express");

/**
 * Define as rotas relacionadas aos pedidos
 * 
 * @module pedidoRoutes 
 * 
 * @description
 * - GET /entregas -> lista todas as entregas do banco de dados.

 */
// GET /entregas -> listar uma ou mais entregas
router.get("/entregas", entregasController.listarEntrega);

module.exports = { entregasRoutes: router };