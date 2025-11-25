const express = require("express");
const router = express.Router();
const { entregasController } = require("../controllers/entregasController");

// GET /pedidos -> listar um ou mais pedidos
router.get("/entregas", entregasController.listarEntrega);


module.exports = { entregasRoutes: router };