const { sql, getConnection } = require("../config/db");
const { entregasModel } = require("../models/entregasModel");

const entregasController = {

    //----------------
    // CRIAR ENTREGA
    // POST /entregas
    //----------------
    criarEntrega: async (req, res) => {
        try {
            const pool = await getConnection();
            const { idPedido, statusEntrega } = req.body;

            //puxar dados da tabela dos pedidos
            let querysql = `
            SELECT distanciaKM, pesoDaCarga, valorBaseKM, valorBaseKG
            FROM Pedidos
            WHERE idPedido = @idPedido
            `;

            let result = await pool.request()
                .input('idPedido', sql.UniqueIdentifier, idPedido)
                .query(querysql);


            //para pegar o primeiro resultado
            const rs = result.recordset[0];

            //valor da distancia
            let valorDistancia = rs.distanciaKM * rs.valorBaseKM;

            //valor do peso
             let valorPeso = rs.pesoDaCarga * rs.valorBaseKG;

            //valor de base
            let valorBase = valorDistancia + valorPeso;

            let valorFinal = valorBase;
            let acrescimo = 0;

            //caso a entrega seja urgente, acrescimo de 20%
            if (rs.tipoEntrega == "urgente".toLowerCase()) {
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
            if (rs.pesoDaCarga > 50) {
                taxaExtra = 15;
                valorFinal = valorFinal + taxaExtra;
                
            };


            await entregasModel.inserirEntrega(idPedido, valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega);
            res.status(201).json({ message: "Entrega cadastrada com sucesso!" });

            console.log("O valor final é:" + valorFinal);

        } catch (error) {
            console.error("Erro ao cadastrar entrega:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao cadastrar entrega" });
        }
    },

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