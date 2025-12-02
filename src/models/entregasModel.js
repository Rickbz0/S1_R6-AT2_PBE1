const { UniqueIdentifier } = require("mssql");
const { sql, getConnection } = require("../config/db");

const entregasModel = {
    /**
     * busca todas as entragas e seus respectivos itens no banco de dados.
     * 
     * @async
     * @function buscarTodos
     * @returns {Promise<Array>} Retorna uma lista com todas as entregas e seus itens.
     * @throws Mostra no console o erro e propaga o erro caso a busca falhe.
     */
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
    }
    

}

module.exports = { entregasModel };