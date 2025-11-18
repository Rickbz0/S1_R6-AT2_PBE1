const { pedidosModel } = require("../models/pedidosModel");
const { clienteModel } = require("../models/clienteModel");
//const { pedidoModel } = require("../models/pedidosModel");

const pedidosController = {
    //-----------------
    //LISTAR PEDIDOS
    //GET /pedidos
    //-----------------
    listarPedido: async (req, res) => {
        try {
            const { idPedido } = req.query;

            //para listar um unico cliente pelo id
            if (idPedido) {

                if (idPedido.length != 36) {
                    return res.status(400).json({ erro: 'Id do pedido inválido!' });
                }

                let pedido = await pedidosModel.buscarUm(idPedido);
                res.status(200).json(pedido);

            }

            //para listar todos os clientes
            const pedidos = await pedidosModel.buscarTodos();

            res.status(200).json(pedidos)

        } catch (error) {
            console.error('Erro ao listar todos os clientes', error);
            throw error;
        }
    },


    //----------------
    // CRIAR PEDIDO
    // POST /pedidos
    //----------------
    criarPedido: async (req, res) => {
        try {

            const { idCliente, dataPedido, tipoEntrega, distanciaKM, pesoDaCarga, valorBaseKM, valorBaseKG } = req.body;

            if (idCliente == undefined || dataPedido == undefined || tipoEntrega == undefined || distanciaKM == undefined || pesoDaCarga == undefined || valorBaseKM == undefined || valorBaseKG == undefined) {
                return res.status(400).json({ erro: "Campos obrigatorios não preenchidos" });
            }

            if (idCliente.length != 36) {
                return res.status(400).json({ erro: "id do cliente invalido" });
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length != 1) {
                return res.status(404).json({ erro: "Cliente não encontrado" });
            }

            await pedidosModel.inserirPedido(idCliente, dataPedido, tipoEntrega, distanciaKM, pesoDaCarga, valorBaseKM, valorBaseKG);

            res.status(201).json({ message: "Pedido cadastrado com sucesso!" });

        } catch (error) {
            console.error("Erro ao cadastrar pedido:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao cadastrar pedido" });

        }
    }
}

module.exports = { pedidosController };