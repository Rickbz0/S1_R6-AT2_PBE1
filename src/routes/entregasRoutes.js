const express = require("express");
const router = express.Router();
const { entregasController } = require("../controllers/entregasController");

// GET /entregas -> listar uma ou mais entregas
router.get("/entregas", entregasController.listarEntrega);
// POST /entregas -> criar entregas
router.post("/entregas", entregasController.criarEntrega);


module.exports = { entregasRoutes: router };