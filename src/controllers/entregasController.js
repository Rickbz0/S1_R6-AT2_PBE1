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

    deletarEntrega: async (req, res) => {
        try {
            const { idEntrega } = req.params;

            //validação da entrega
            if (idEntrega.length != 36) {
                return res.status(400).json({ erro: "id da entrega invalido" });
            };

            await entregasModel.deletarEntrega(idEntrega);

            res.status(200).json({ mensagem: "entrega deletado com sucesso" });

        } catch (error) {
            console.error("Erro ao deletar entrega:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao deletar entrega" });
        }
    }
}

module.exports = { entregasController };