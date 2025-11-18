const { UniqueIdentifier } = require("mssql");
const { sql, getConnection } = require("../config/db");

const pedidosModel = {
    //-------------------------
    //LISTAR TODOS OS PEDIDOS
    //-------------------------
    buscarTodos: async () => {
        try {

            const pool = await getConnection();
            let sql = `SELECT * FROM Pedidos`;

            const result = await pool.request().query(sql);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar os pedidos', error);
            throw error;
        }
    },
    //-------------------
    //LISTAR UM PEDIDO
    //-------------------
    buscarUm: async (idPedido) => {
        try {
            const pool = await getConnection();

            const querysql = `SELECT * FROM Pedidos WHERE idPedido = @idPedido`;

            const result = await pool.request()
                .input('idPedido', sql.UniqueIdentifier, idPedido)
                .query(querysql);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar esse pedido', error);
            throw error;
        }
    },
    //--------------
    //CRIAR PEDIDOS
    //--------------
    inserirPedido: async (idCliente, dataPedido, tipoEntrega, distanciaKM, pesoDaCarga, valorBaseKM, valorBaseKG) => {

        const pool = await getConnection();

        const transaction = new sql.Transaction(pool);
        await transaction.begin(); // inicia a transação

        try {


            let querysql = `
            INSERT INTO Pedidos
            (idCliente, dataPedido, tipoEntrega, distanciaKM, pesoDaCarga, valorBaseKM, valorBaseKG) 
            VALUES(@idCliente, @dataPedido, @tipoEntrega, @distanciaKM, @pesoDaCarga, @valorBaseKM, @valorBaseKG)`;

            await transaction.request()
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .input('dataPedido', sql.Date, dataPedido)
                .input('tipoEntrega', sql.VarChar(7), tipoEntrega)
                .input('distanciaKM', sql.Decimal(10, 2), distanciaKM)
                .input('pesoDaCarga', sql.Decimal(10, 2), pesoDaCarga)
                .input('valorBaseKM', sql.Decimal(10, 2), valorBaseKM)
                .input('valorBaseKG', sql.Decimal(10, 2), valorBaseKG)
                .query(querysql);


            await transaction.commit(); // confirma a transação(salva tudo no banco)

        } catch (error) {
            await transaction.rollback(); // desfaz tudo caso de erro
            console.error('Erro ao inserir pedido', error);
            throw error; // passa o erro para o controller tratar
        }
    },
    //------------------
    //ATUALIZAR PEDIDOS
    //------------------
    atualizarPedido: async (idPedido, idCliente, dataPedido, tipoEntrega, distanciaKM, pesoDaCarga, valorBaseKM, valorBaseKG) => {
        try {

            const pool = await getConnection();
            const querySQL = `
                UPDATE Pedidos
                SET idCliente = @idCliente, 
                dataPedido = @dataPedido, 
                tipoEntrega = @tipoEntrega, 
                distanciaKM = @distanciaKM, 
                pesoDaCarga = @pesoDaCarga, 
                valorBaseKM = @valorBaseKM, 
                valorBaseKG = @valorBaseKG
            WHERE idPedido = @idPedido
            `

            await pool.request()
                .input('idPedido', sql.UniqueIdentifier, idPedido)
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .input('dataPedido', sql.Date, dataPedido)
                .input('tipoEntrega', sql.VarChar(7), tipoEntrega)
                .input('distanciaKM', sql.Decimal(10, 2), distanciaKM)
                .input('pesoDaCarga', sql.Decimal(10, 2), pesoDaCarga)
                .input('valorBaseKM', sql.Decimal(10, 2), valorBaseKM)
                .input('valorBaseKG', sql.Decimal(10, 2), valorBaseKG)
                .query(querySQL)

        } catch (error) {
            console.error("Erro ao atualizar pedido", error);
            throw error;
        }

    },

    //-------------------
    //DELETAR PEDIDOS
    //-------------------
    deletarPedido: async (idPedido) => {

        const pool = await getConnection();

        const transaction = new sql.Transaction(pool);
        await transaction.begin(); // inicia a transação

        try {

            const querySQL = 'DELETE FROM  Pedidos WHERE idPedido = @idPedido';

            await transaction.request()
                .input('idPedido', sql.UniqueIdentifier, idPedido)
                .query(querySQL);

                await transaction.commit();



        } catch (error) {
            await transaction.rollback();
            console.error('Erro ao deletar o pedido:', error);
            throw error;
        }
    }

}

module.exports = { pedidosModel };