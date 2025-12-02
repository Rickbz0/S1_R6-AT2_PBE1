const express = require("express");
const router = express.Router();
const { clienteController } = require("../controllers/clienteController");

/**
 * Define as rotas relacionadas aos clientes
 * 
 * @module clienteRoutes 
 * 
 * @description
 * - GET /clientes -> lista todos os clientes do banco de dados.
 * - POST /clientes -> criar um novo cliente e os seus itens com os dados enviados pelo cliente HTTP
 * - PUT /clientes -> atualizar um novo cliente
 * - DELETE /clientes -> deletar um clinte 
 */

// GET /clientes -> listar um ou mais clientes
router.get("/clientes", clienteController.listarClientes);
// POST /clientes -> Cria um novo cliente
router.post("/clientes", clienteController.criarCliente);
// PUT /clientes -> atualizar cliente
router.put("/clientes/:idCliente", clienteController.atualizarCliente);
// DELETE /clientes -> deletar cliente
router.delete("/clientes/:idCliente", clienteController.deletarCliente);


module.exports = { clienteRoutes: router }