const { UniqueIdentifier } = require("mssql");
const { sql, getConnection } = require("../config/db");

const entregasModel = {
    //------------------------
    //LISTAR TODAS AS ENTREGAS
    //------------------------
    buscarTodos: async () => {
        try {

            const pool = await getConnection();
            let sql = `SELECT * FROM Entregas`;

            const result = await pool.request().query(sql);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar as entregas', error);
            throw error;
        }
    },

    //-------------------
    //LISTAR UMA ENTREGA
    //-------------------
    buscarUm: async (idEntrega) => {
        try {
            const pool = await getConnection();

            const querysql = `
            SELECT * FROM Entregas 
            WHERE idEntrega = @idEntrega
            `;

            const result = await pool.request()
                .input('idEntrega', sql.UniqueIdentifier, idEntrega)
                .query(querysql);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar a entrega', error);
            throw error;
        }
    },

    //-------------------
    //ATUALIZAR ENTREGA
    //-------------------
    atualizarEntrega: async (idPedido, valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega) => {
        try {
            const pool = await getConnection();

            const querysql = `
            UPDATE Clientes
                SET idPedido = @idPedido, 
                valorDistancia = @valorDistancia, 
                valorPeso = @valorPeso, 
                acrescimo = @acrescimo, 
                desconto = @desconto, 
                taxaExtra = @taxaExtra, 
                valorFinal = @valorFinal, 
                statusEntrega = @statusEntrega
                WHERE idCliente = @idCliente 
            `;

            await pool.request()
                .input('idPedido', sql.UniqueIdentifier, idPedido)
                .input('valorDistancia', sql.VarChar(100), valorDistancia)
                .input('valorPeso', sql.VarChar(11), valorPeso)
                .input('acrescimo', sql.Char(11), acrescimo)
                .input('desconto', sql.VarChar(200), desconto)
                .input('taxaExtra', sql.VarChar(200), taxaExtra)
                .input('valorFinal', sql.VarChar(200), valorFinal)
                .input('statusEntrega', sql.VarChar(200), statusEntrega)
                .query(querysql);

        } catch (error) {
            console.error('Erro ao atualizar a entrega:', error);
            throw error;
        }
    },

    

}

module.exports = { entregasModel };