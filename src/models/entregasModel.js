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
    /**
     * listar somente uma entrega pelo id
     * 
     * @async
     * @function buscarUm
     * @param {*} idEntrega 
     * @returns retorna uma lista com uma unica entrega buscada pelo id
     */
    buscarUm: async (idPedido) => {
        try {
            const pool = await getConnection();

            const querysql = `
            SELECT * FROM Entregas 
            WHERE idPedido = @idPedido
            `;

            const result = await pool.request()
                .input('idPedido', sql.UniqueIdentifier, idPedido)
                .query(querysql);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar a entrega', error);
            throw error;
        }
    },

    //--------------------
    //DELETAR UMA ENTREGA
    //--------------------
    /**
     * deletar uma entrega relacionada a um pedido
     * 
     * @async
     * @function deletarEntrega
     * @param {*} idEntrega 
     * @returns "mensagem": "entrega deletado com sucesso"
     */
    deletarEntrega: async (idEntrega) => {

    const pool = await getConnection();

    const transaction = new sql.Transaction(pool);
    await transaction.begin(); // inicia a transação

    try {

        //delete da entrega
        await transaction.request()
            .input('idEntrega', sql.UniqueIdentifier, idEntrega)
            .query(`
                     DELETE FROM  Entregas
                     WHERE idEntrega = @idEntrega
                     `);

        await transaction.commit();



    } catch (error) {
        await transaction.rollback();
        console.error('Erro ao deletar a entrega', error);
        throw error;
    }
}
    

}

module.exports = { entregasModel };