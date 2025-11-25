const { sql, getConnection } = require("../config/db");
const { entregasModel } = require("../models/entregasModel");
const { pedidosModel } = require("../models/pedidosModel");

const entregasController = {

    

    //-----------------
    //LISTAR ENTREGAS
    //GET /entregas
    //-----------------
    listarEntrega: async (req, res) => {
        try {
            const { idEntrega } = req.query;

            //para listar uma unica entrega pelo id
            if (idEntrega) {

                if (idEntrega.length != 36) {
                    return res.status(400).json({ erro: 'Id da entrega inválido!' });
                }

                let entrega = await entregasModel.buscarUm(idEntrega);
                res.status(200).json(entrega);

            }

            //para listar todas as entregas
            const entregas = await entregasModel.buscarTodos();

            res.status(200).json(entregas)

        } catch (error) {
            console.error('Erro ao listar todas as entregas', error);
            throw error;
        }
    },

    //-------------------
    // ATUALIZAR PEDIDO
    // PUT /pedidos
    //-------------------
    atualizarEntrega: async (req, res) => {
        try {

            const { idEntrega } = req.params;
            const { idPedido, valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega } = req.body;

            if (idEntrega.length != 36) {
                return res.status(400).json({ erro: "id da entrega invalido" });
            }

            const entrega = await entregasModel.buscarUm(idEntrega);

            if (!entrega || entrega.length !== 1) {
                return res.status(404).json({ erro: "entrega não encontrado" });
            }

            if (idPedido) {
                if (idPedido.length != 36) {
                    return res.status(400).json({ erro: "id do pedido invalido" });
                }

                const pedido = await pedidosModel.buscarUm(idPedido);

                if (!pedido || pedido.length !== 1) {
                    return res.status(404).json({ erro: "pedido não encontrado" });
                }
            }

            const entregaAtual = pedido[0];
            const statusEntregaAtualizado = statusEntrega ?? entregaAtual.statusEntrega
            const dataPedidoAtualizado = dataPedido ?? pedidoAtual.dataPedido
            const tipoEntregaAtualizado = tipoEntrega ?? pedidoAtual.tipoEntrega
            const distanciaKMatualizado = distanciaKM ?? pedidoAtual.distanciaKM
            const pesoDaCargaAtualizado = pesoDaCarga ?? pedidoAtual.pesoDaCarga
            const valorBaseKMatualizado = valorBaseKM ?? pedidoAtual.valorBaseKM
            const valorBaseKGatualizado = valorBaseKG ?? pedidoAtual.valorBaseKG

            await pedidosModel.atualizarPedido(idPedido, valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega);

            res.status(200).json({ mensagem: "Pedido atualizado com sucesso" });

        } catch (error) {
            console.error("Erro ao atualizar pedido:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao atualizar pedido" });
        }
    }

}

module.exports = { entregasController };