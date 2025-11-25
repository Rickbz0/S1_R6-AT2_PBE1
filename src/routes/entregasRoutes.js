const express = require("express");
const router = express.Router();
const { entregasController } = require("../controllers/entregasController");
const e = require("express");

// GET /entregas -> listar uma ou mais entregas
router.get("/entregas", entregasController.listarEntrega);
// DELETE /entregas -> deletar entrega
router.delete("/entregas/:idEntrega", entregasController.deletarEntrega);

module.exports = { entregasRoutes: router };