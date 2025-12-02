const { UniqueIdentifier } = require("mssql");
const { sql, getConnection } = require("../config/db");

const pedidosModel = {
    /**
     * busca todos os pedidos e seus respectivos itens no banco de dados.
     * 
     * @async
     * @function buscarTodos
     * @returns {Promise<Array>} Retorna uma lista com todos os pedidos e seus itens.
     * @throws Mostra no console o erro e propaga o erro caso a busca falhe.
     */
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
    //-------------------------
    //CRIAR PEDIDOS E ENTREGAS
    //-------------------------
    inserirPedido: async (idCliente, dataPedido, tipoEntrega, distanciaKM, pesoDaCarga, valorBaseKM, valorBaseKG, valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega) => {

        const pool = await getConnection();

        const transaction = new sql.Transaction(pool);
        await transaction.begin(); // inicia a transação

        try {

            //querysql de pedidos
            let querysql = `
            INSERT INTO Pedidos
            (idCliente, dataPedido, tipoEntrega, distanciaKM, pesoDaCarga, valorBaseKM, valorBaseKG) 
            OUTPUT INSERTED.idPedido
            VALUES(@idCliente, @dataPedido, @tipoEntrega, @distanciaKM, @pesoDaCarga, @valorBaseKM, @valorBaseKG)`;

            const result = await transaction.request()
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .input('dataPedido', sql.Date, dataPedido)
                .input('tipoEntrega', sql.VarChar(7), tipoEntrega)
                .input('distanciaKM', sql.Decimal(10, 2), distanciaKM)
                .input('pesoDaCarga', sql.Decimal(10, 2), pesoDaCarga)
                .input('valorBaseKM', sql.Decimal(10, 2), valorBaseKM)
                .input('valorBaseKG', sql.Decimal(10, 2), valorBaseKG)
                .query(querysql);
            '            '
            const idPedido = result.recordset[0].idPedido;

            console.log(idPedido);

            //querysql de entregas
            querysql = `
            INSERT INTO Entregas(idPedido, valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega)
            VALUES(@idPedido, @valorDistancia, @valorPeso, @acrescimo, @desconto, @taxaExtra, @valorFinal, @statusEntrega)
            `;

            await transaction.request()
                .input('idPedido', sql.UniqueIdentifier, idPedido)
                .input('valorDistancia', sql.Decimal(10, 2), valorDistancia)
                .input('valorPeso', sql.Decimal(10, 2), valorPeso)
                .input('acrescimo', sql.Decimal(10, 2), acrescimo)
                .input('desconto', sql.Decimal(10, 2), desconto)
                .input('taxaExtra', sql.Decimal(10, 2), taxaExtra)
                .input('valorFinal', sql.Decimal(10, 2), valorFinal)
                .input('statusEntrega', sql.VarChar(9), statusEntrega)
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
    atualizarPedido: async (
        idPedido,
        idCliente,
        dataPedido,
        tipoEntrega,
        distanciaKM,
        pesoDaCarga,
        valorBaseKM,
        valorBaseKG,
        acrescimo,
        desconto,
        taxaExtra,
        valorDistancia,
        valorPeso,
        valorFinal,
        statusEntrega) => {

        const pool = await getConnection();

        const transaction = new sql.Transaction(pool);
        await transaction.begin(); // inicia a transação

        try {

            const pool = await getConnection();

            //atualizar pedidos
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

            await transaction.request()
                .input('idPedido', sql.UniqueIdentifier, idPedido)
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .input('dataPedido', sql.Date, dataPedido)
                .input('tipoEntrega', sql.VarChar(7), tipoEntrega)
                .input('distanciaKM', sql.Decimal(10, 2), distanciaKM)
                .input('pesoDaCarga', sql.Decimal(10, 2), pesoDaCarga)
                .input('valorBaseKM', sql.Decimal(10, 2), valorBaseKM)
                .input('valorBaseKG', sql.Decimal(10, 2), valorBaseKG)
                .query(querySQL);

            //atualizar entrega
            querySQL = `
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

            await transaction.request()
                    .input('idPedido', sql.UniqueIdentifier, idPedido)
                    .input('valorDistancia', sql.VarChar(100), valorDistancia)
                    .input('valorPeso', sql.VarChar(11), valorPeso)
                    .input('acrescimo', sql.Char(11), acrescimo)
                    .input('desconto', sql.VarChar(200), desconto)
                    .input('taxaExtra', sql.VarChar(200), taxaExtra)
                    .input('valorFinal', sql.VarChar(200), valorFinal)
                    .input('statusEntrega', sql.VarChar(200), statusEntrega)
                    .query(querySQL);

            await transaction.commit(); // confirma a transação(salva tudo no banco)

        } catch (error) {
            await transaction.rollback(); // desfaz tudo caso de erro
            console.error('Erro ao atualizar pedido', error);
            throw error; // passa o erro para o controller tratar
        }

    },


//-------------------
//DELETAR PEDIDOS
//-------------------
deletarPedido: async (idPedido, idEntrega) => {

    const pool = await getConnection();

    const transaction = new sql.Transaction(pool);
    await transaction.begin(); // inicia a transação

    try {

        //delete do pedido
        await transaction.request()
            .input('idPedido', sql.UniqueIdentifier, idPedido)
            .query(`
                    DELETE FROM  Pedidos
                    WHERE idPedido = @idPedido`);

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
        console.error('Erro ao deletar o pedido e/ou a entrega', error);
        throw error;
    }
}

}

module.exports = { pedidosModel };