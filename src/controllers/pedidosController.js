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

            //para listar um unico pedido pelo id
            if (idPedido) {

                if (idPedido.length != 36) {
                    return res.status(400).json({ erro: 'Id do pedido inválido!' });
                }

                let pedido = await pedidosModel.buscarUm(idPedido);
                res.status(200).json(pedido);

            }

            //para listar todos os pedidos
            const pedidos = await pedidosModel.buscarTodos();

            res.status(200).json(pedidos)

        } catch (error) {
            console.error('Erro ao listar todos os pedidos', error);
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
    },

    //-------------------
    // ATUALIZAR PEDIDO
    // PUT /pedidos
    //-------------------
    atualizarPedido: async (req, res) => {
        try {

            const { idPedido } = req.params;
            const { idCliente, dataPedido, tipoEntrega, distanciaKM, pesoDaCarga, valorBaseKM, valorBaseKG } = req.body;

            if (idPedido.length != 36) {
                return res.status(400).json({ erro: "id do pedido invalido" });
            }

            const pedido = await pedidosModel.buscarUm(idPedido);

            if (!pedido || pedido.length !== 1) {
                return res.status(404).json({ erro: "Pedido não encontrado" });
            }

            if (idCliente) {
                if (idCliente.length != 36) {
                    return res.status(400).json({ erro: "id do cliente invalido" });
                }

                const cliente = await clienteModel.buscarUm(idCliente);

                if (!cliente || cliente.length !== 1) {
                    return res.status(404).json({ erro: "Cliente não encontrado" });
                }
            }

            const pedidoAtual = pedido[0];

            const idClienteAtualizado = idCliente ?? pedidoAtual.idCliente
            const dataPedidoAtualizado = dataPedido ?? pedidoAtual.dataPedido
            const tipoEntregaAtualizado = tipoEntrega ?? pedidoAtual.tipoEntrega
            const distanciaKMatualizado = distanciaKM ?? pedidoAtual.distanciaKM
            const pesoDaCargaAtualizado = pesoDaCarga ?? pedidoAtual.pesoDaCarga
            const valorBaseKMatualizado = valorBaseKM ?? pedidoAtual.valorBaseKM
            const valorBaseKGatualizado = valorBaseKG ?? pedidoAtual.valorBaseKG

            await pedidosModel.atualizarPedido(idPedido, idClienteAtualizado, dataPedidoAtualizado, tipoEntregaAtualizado, distanciaKMatualizado, pesoDaCargaAtualizado, valorBaseKMatualizado, valorBaseKGatualizado);

            res.status(200).json({ mensagem: "Pedido atualizado com sucesso" });

        } catch (error) {
            console.error("Erro ao atualizar pedido:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao atualizar pedido" });
        }
    },

    //--------------------
    // DELETAR PEDIDOS
    // DELETE /pedidos
    //--------------------
    deletarPedido: async (req, res) => {
        try {
            const {idPedido} = req.params;
            
            //validação do pedido
            if (idPedido.length != 36) {
                return res.status(400).json({erro: "id do pedido invalido"});
            }
            
            const pedido = await pedidosModel.buscarUm(idPedido);
            
            if (!pedido || pedido.length !==1 ) {
                return res.status(404).json({erro: "Pedido não encontrado"});
            }
            
            await pedidosModel.deletarPedido(idPedido);

            res.status(200).json({mensagem: "Pedido deletado com sucesso"});
            
        } catch (error) {
            console.error("Erro ao deletar pedido:", error);
            res.status(500).json({erro: "Erro interno no servidor ao deletar pedido"}); 
        }
    }

}

module.exports = { pedidosController };