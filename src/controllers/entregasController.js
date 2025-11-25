const { pool } = require("mssql");
const { entregasModel } = require("../models/entregasModel");

const entregasController = {

    // criarEntrega: async (req, res) => {
    //     try {
    //         const pool = await getConnection();
    //         const { idPedido, statusEntrega } = req.body;
    //         //let sql = `SELECT idPedido, valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega
    //         //FROM Pedidos`;
    //         let querysql = `
    //         SELECT distanciaKM, pesoDaCarga, valorBaseKM, valorBaseKG
    //         FROM Pedidos
    //         WHERE idPedido = @idPedido
    //         `;

    //         let result = await pool.request()
    //             .input('idPedido', sql.UniqueIdentifier, idPedido)
    //             .query(querysql);

    //         const rs = result.recordset[0]

    //         let val




    //     } catch (error) {

    //     }
    // }

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



}

module.exports = { entregasController };