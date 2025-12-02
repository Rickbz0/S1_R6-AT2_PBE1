const { pedidosModel } = require("../models/pedidosModel");
const { clienteModel } = require("../models/clienteModel");
const { entregasModel } = require("../models/entregasModel");
//const { pedidoModel } = require("../models/pedidosModel");

const pedidosController = {

    /**
     * Controlador que lista todos os pedidos do banco de dados
     * 
     * @async
     * @function listarPedidos
     * @param {object} req - Objeto da requisicao "recebido do cliente HTTP"
     * @param {object} res - Objeto da resposta do servidor "enviado ao cliente HTTP"
     * @return {Promise<void>} Retorna uma resposta JSON com a lista de produtos.
     * @throws Mostra no console e retorna erro 500 se ocorrer falha ao buscar os pedidos. 
     */

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


    //------------------------
    // CRIAR PEDIDO E ENTREGA
    // POST /pedidos
    //------------------------
    criarPedido: async (req, res) => {
        try {

            const {
                idCliente,
                dataPedido,
                tipoEntrega,
                distanciaKM,
                pesoDaCarga,
                valorBaseKM,
                valorBaseKG,
                statusEntrega
            } = req.body;

            //criar PEDIDO
            if (idCliente == undefined ||
                dataPedido == undefined ||
                tipoEntrega == undefined ||
                distanciaKM == undefined ||
                pesoDaCarga == undefined ||
                valorBaseKM == undefined ||
                valorBaseKG == undefined
            ) {
                return res.status(400).json({ erro: "Campos obrigatorios não preenchidos" });
            }

            if (idCliente.length != 36) {
                return res.status(400).json({ erro: "id do cliente invalido" });
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length != 1) {
                return res.status(404).json({ erro: "Cliente não encontrado" });
            }

            //criar ENTREGA

            //valor da distancia
            let valorDistancia = distanciaKM * valorBaseKM;

            //valor do peso
            let valorPeso = pesoDaCarga * valorBaseKG;

            //valor de base
            let valorBase = valorDistancia + valorPeso;

            let valorFinal = valorBase;
            let acrescimo = 0;

            //caso a entrega seja urgente, acrescimo de 20%
            if (tipoEntrega == "urgente".toLowerCase()) {
                acrescimo = valorBase * 1.2;
                valorFinal = valorFinal + acrescimo;
            };

            let desconto = 0;
            //se o valor final da entrega for superior à 500 reais, desconto de 10%
            if (valorFinal > 500) {
                desconto = valorFinal * 0.1;
                valorFinal = valorFinal - desconto;
            };

            let taxaExtra = 0;
            //se o peso da carga for maior que 50kg, adicionar uma taxa fixa de 15 reais
            if (pesoDaCarga > 50) {
                taxaExtra = 15;
                valorFinal = valorFinal + taxaExtra;

            };

            statusEntregaDefault = "calculado";
            if (statusEntrega) {
                if (statusEntrega.toLowerCase() != "calculado" && statusEntrega.toLowerCase() != "entregue" && statusEntrega.toLowerCase() != "cancelado" && statusEntrega.toLowerCase() != "em transito") {
                    return res.status(400).json({ erro: "Status entrega inválido" });
                }

                statusEntregaDefault = statusEntrega;
            }


            await pedidosModel.inserirPedido(idCliente,
                dataPedido,
                tipoEntrega,
                distanciaKM,
                pesoDaCarga,
                valorBaseKM,
                valorBaseKG,
                valorDistancia,
                valorPeso,
                acrescimo,
                desconto,
                taxaExtra,
                valorFinal,
                statusEntregaDefault);

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
          
            const {
                idCliente,
                dataPedido,
                tipoEntrega,
                distanciaKM,
                pesoDaCarga,
                valorBaseKM,
                valorBaseKG,
                statusEntrega } = req.body;

            //atualizar pedido
            if (idPedido.length != 36) {
                return res.status(400).json({ erro: "id do pedido invalido" });
            }

            const pedido = await pedidosModel.buscarUm(idPedido);

            if (!pedido || pedido.length !== 1) {
                return res.status(404).json({ erro: "Pedido não encontrado" });
            }

            const pedidoAntigo = pedido[0];
            const entregaAntigo = await entregasModel.buscarUm(idPedido);
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa ',pedido[0]);
            

            if (idCliente) {
                if (idCliente.length != 36) {
                    return res.status(400).json({ erro: "id do cliente invalido" });
                }

                const cliente = await clienteModel.buscarUm(idCliente);

                if (!cliente || cliente.length !== 1) {
                    return res.status(404).json({ erro: "Cliente não encontrado" });
                }
            }

            statusEntregaDefault = "calculado";
            if (statusEntrega) {
                if (statusEntrega.toLowerCase() != "calculado" &&
                    statusEntrega.toLowerCase() != "entregue" &&
                    statusEntrega.toLowerCase() != "cancelado" &&
                    statusEntrega.toLowerCase() != "em transito") {
                    return res.status(400).json({ erro: "Status entrega inválido" });
                }

                statusEntregaDefault = statusEntrega;
            }

            const pedidoAtual = pedido[0];

            const idClienteAtualizado = idCliente ?? pedidoAtual.idCliente;
            const dataPedidoAtualizado = dataPedido ?? pedidoAtual.dataPedido;
            const tipoEntregaAtualizado = tipoEntrega ?? pedidoAtual.tipoEntrega;
            const distanciaKMatualizado = distanciaKM ?? pedidoAtual.distanciaKM;
            const pesoDaCargaAtualizado = pesoDaCarga ?? pedidoAtual.pesoDaCarga;
            const valorBaseKMatualizado = valorBaseKM ?? pedidoAtual.valorBaseKM;
            const valorBaseKGatualizado = valorBaseKG ?? pedidoAtual.valorBaseKG;
            const statusEntregaAtualizado = statusEntrega ?? entregaAntigo[0].statusEntrega;

            const valorDistanciaAtualizado = distanciaKMatualizado * valorBaseKMatualizado;

            const valorPesoAtualizado = pesoDaCargaAtualizado * valorBaseKGatualizado;

            let valorBaseAtualizado = valorDistanciaAtualizado + valorPesoAtualizado;

            let valorFinalAtualizado = valorBaseAtualizado;
            let acrescimoAtualizado = 0;

            if (tipoEntregaAtualizado == "urgente".toLowerCase()) {
                acrescimoAtualizado = valorBaseAtualizado * 1.2;
                valorFinalAtualizado = valorFinalAtualizado + acrescimoAtualizado;
            };

            let descontoAtualizado = 0;
            if (valorFinalAtualizado > 500) {
                descontoAtualizado = valorFinalAtualizado * 0.1;
                valorFinalAtualizado = valorFinalAtualizado - descontoAtualizado;
            };

            let taxaExtraAtualizado = 0;
            //se o peso da carga for maior que 50kg, adicionar uma taxa fixa de 15 reais
            if (pesoDaCargaAtualizado > 50) {
                taxaExtraAtualizado = 15;
                valorFinalAtualizado = valorFinalAtualizado + taxaExtraAtualizado;
            };


            await pedidosModel.atualizarPedido(
                idPedido, 
                idClienteAtualizado, 
                dataPedidoAtualizado, 
                tipoEntregaAtualizado, 
                distanciaKMatualizado, 
                pesoDaCargaAtualizado, 
                valorBaseKMatualizado, 
                valorBaseKGatualizado,
                acrescimoAtualizado,
                descontoAtualizado,
                statusEntregaAtualizado,
                valorDistanciaAtualizado,
                taxaExtraAtualizado,
                valorPesoAtualizado,
                valorFinalAtualizado,
                entregaAntigo[0].idEntrega
            );

            res.status(200).json({ mensagem: "Pedido atualizado com sucesso" });

        } catch (error) {
            console.error("Erro ao atualizar pedido:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao atualizar pedido",errorMessage: error.message });

        }
    },


    //--------------------
    // DELETAR PEDIDOS
    // DELETE /pedidos
    //--------------------
    deletarPedido: async (req, res) => {
        try {
            const { idPedido } = req.params;

            //validação do pedido
            if (idPedido.length != 36) {
                return res.status(400).json({ erro: "id do pedido invalido" });
            };

            await pedidosModel.deletarPedido(idPedido);

            res.status(200).json({ mensagem: "Pedido deletado com sucesso" });

        } catch (error) {
            console.error("Erro ao deletar pedido:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao deletar pedido" });
        }
    }

}

module.exports = { pedidosController };