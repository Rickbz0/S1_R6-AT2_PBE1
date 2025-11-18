const express = require("express");
const router = express.Router();
const { pedidosController } = require("../controllers/pedidosController");

// GET /pedidos -> listar um ou mais pedidos
router.get("/pedidos", pedidosController.listarPedido);
// POST /pedidos -> Cria um novo pedido
router.post("/pedidos", pedidosController.criarPedido);
// PUT /pedidos -> atualizar um pedido
router.put("/pedidos/:idPedido", pedidosController.atualizarPedido);

module.exports = { pedidoRoutes: router };