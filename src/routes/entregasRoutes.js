const express = require("express");
const router = express.Router();
const { entregasController } = require("../controllers/entregasController");
const e = require("express");

/**
 * Define as rotas relacionadas as entregas
 * 
 * @module entregasRoutes 
 * 
 * @description
 * - GET /entregas -> lista todas as entregas do banco de dados.

 */
// GET /entregas -> listar uma ou mais entregas
router.get("/entregas", entregasController.listarEntrega);
// DELETE /entregas -> deletar uma entrega
router.delete("/entregas/:idEntrega", entregasController.deletarEntrega);

module.exports = { entregasRoutes: router };