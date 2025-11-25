const { UniqueIdentifier } = require("mssql");
const { sql, getConnection } = require("../config/db");

const entregasModel = {
    //-----------------------
    //CRIAR UMA NOVA ENTREGA
    //-----------------------
    inserirEntrega: async (idPedido, valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega) => {
        try {
            const pool = await getConnection();

            let querysql = `INSERT INTO Entregas(idPedido, valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega)
            VALUES(@idPedido, @valorDistancia, @valorPeso, @acrescimo, @desconto, @taxaExtra, @valorFinal, @statusEntrega)`;

            await pool.request()
                .input('idPedido', sql.UniqueIdentifier, idPedido)
                .input('valorDistancia', sql.Decimal(10, 2), valorDistancia)
                .input('valorPeso', sql.Decimal(10, 2), valorPeso)
                .input('acrescimo', sql.Decimal(10, 2), acrescimo)
                .input('desconto', sql.Decimal(10, 2), desconto)
                .input('taxaExtra', sql.Decimal(10, 2), taxaExtra)
                .input('valorFinal', sql.Decimal(10, 2), valorFinal)
                .input('statusEntrega', sql.VarChar(9), statusEntrega)
                .query(querysql);

        } catch (error) {
            console.error('Erro ao inserir entrega!', error);
            throw error; // passa o erro para o controller tratar
        }
    },

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

}

module.exports = { entregasModel };