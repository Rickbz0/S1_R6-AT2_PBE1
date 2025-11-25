const express = require("express");
const router = express.Router();
const { pedidosController } = require("../controllers/pedidosController");

// GET /pedidos -> listar um ou mais pedidos
router.get("/pedidos", pedidosController.listarPedido);
// POST /pedidos -> Cria um novo pedido e uma nova entrega
router.post("/pedidos", pedidosController.criarPedido);
// PUT /pedidos -> atualizar um pedido e uma entrega
router.put("/pedidos/:idPedido", pedidosController.atualizarPedido);
// DELETE /pedidos -> deletar pedido(junto deleta a entrega)
router.delete("/pedidos/:idPedido", pedidosController.deletarPedido);

module.exports = { pedidoRoutes: router };