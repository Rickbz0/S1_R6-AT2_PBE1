const express = require("express");
const router = express.Router();
const { clienteController } = require("../controllers/clienteController");

// GET /clientes -> listar um ou mais clientes
router.get("/clientes", clienteController.listarClientes);
// POST /clientes -> Cria um novo cliente
router.post("/clientes", clienteController.criarCliente);
// PUT /clientes -> atualizar cliente
router.put("/clientes/:idCliente", clienteController.atualizarCliente);


module.exports = { clienteRoutes: router }