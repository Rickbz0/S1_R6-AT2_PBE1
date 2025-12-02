const { UniqueIdentifier } = require("mssql");
const { sql, getConnection } = require("../config/db");

const clienteModel = {
    /**
     * busca todos os clientes e seus respectivos itens no banco de dados.
     * 
     * @async
     * @function buscarTodos
     * @returns {Promise<Array>} Retorna uma lista com todos os clientes e seus itens.
     * @throws Mostra no console o erro e propaga o erro caso a busca falhe.
     */
    //-------------------------
    //LISTAR TODOS OS CLIENTES
    //-------------------------
    buscarTodos: async () => {
        try {

            const pool = await getConnection();
            let sql = `SELECT * FROM Clientes`;

            const result = await pool.request().query(sql);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar clientes', error);
            throw error;
        }
    },
    //-------------------
    //LISTAR UM CLIENTES
    //-------------------
    /**
     * busca Um e seus respectivos itens no banco de dados.
     * 
     * @async
     * @function buscarUm
     * @returns {Promise<Array>} Retorna uma lista com um unico cliente puxado pelo id e seus itens.
     * @throws Mostra no console o erro e propaga o erro caso a busca falhe.
     */
    buscarUm: async (idCliente) => {
        try {
            const pool = await getConnection();

            const querysql = `SELECT * FROM Clientes WHERE idCliente = @idCliente`;

            const result = await pool.request()
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .query(querysql);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar o cliente', error);
            throw error;
        }
    },

    buscar_CPF_Email: async (cpfCliente, emailCliente) => {
        try {
            const pool = await getConnection();

            const querysql = `SELECT * FROM Clientes WHERE cpfCliente = @cpfCliente OR emailCliente = @emailCliente`;

            const result = await pool.request()
                .input('cpfCliente', sql.VarChar(11), cpfCliente)
                .input('emailCliente', sql.VarChar(200), emailCliente)
                .query(querysql);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar cpf ou email do cliente', error);
            throw error;
        }
    },

    //---------------------
    //CRIAR NOVOS CLIENTES
    //---------------------
    /**
     * cria um novo cliente
     * 
     * @async
     * @function inserirCliente
     * @param {*} nomeCliente 
     * @param {*} cpfCliente 
     * @param {*} telefoneCliente 
     * @param {*} emailCliente 
     * @param {*} enderecoCliente 
     * @returns {Promise<Object>} Retorna o cliente inserido, incluindo o ID gerado
     * @throws Mostra no console o erro e propaga o erro caso a inserção falhe
     */
    inserirCliente: async (nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente) => {
        try {

            const pool = await getConnection();

            let querysql = 'INSERT INTO Clientes(nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente) VALUES(@nomeCliente, @cpfCliente, @telefoneCliente, @emailCliente, @enderecoCliente)';

             await pool.request()
                .input('nomeCliente', sql.VarChar(100), nomeCliente)
                .input('cpfCliente', sql.VarChar(11), cpfCliente)
                .input('telefoneCliente', sql.Char(11), telefoneCliente)
                .input('emailCliente', sql.VarChar(200), emailCliente)
                .input('enderecoCliente', sql.VarChar(200), enderecoCliente)
                .query(querysql);

           

        } catch (error) {
            console.error('Erro ao inserir cliente', error);
            throw error; // passa o erro para o controller tratar
        }
    },

    //-------------------
    //ATUALIZAR CLIENTES
    //-------------------
    /**
     * atualiza um cliente especifico no banco de dados
     * 
     * @async
     * @function atualizarCliente
     * @param {*} idCliente 
     * @param {*} nomeCliente 
     * @param {*} cpfCliente 
     * @param {*} telefoneCliente 
     * @param {*} emailCliente 
     * @param {*} enderecoClientes
     * @returns {Promise<Object>} Retorna os dados atualizados do cliente
     * @throws Mostra no console o erro e propaga o erro caso a atualização falhe
     */
    atualizarCliente: async (idCliente, nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente) => {
        try {
            const pool = await getConnection();

            const querysql = `
            UPDATE Clientes
                SET nomeCliente = @nomeCliente,
                    cpfCliente = @cpfCliente,
                    telefoneCliente = @telefoneCliente, 
                    emailCliente = @emailCliente, 
                    enderecoCliente = @enderecoCliente
                WHERE idCliente = @idCliente 
            `

            await pool.request()
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .input('nomeCliente', sql.VarChar(100), nomeCliente)
                .input('cpfCliente', sql.VarChar(11), cpfCliente)
                .input('telefoneCliente', sql.Char(11), telefoneCliente)
                .input('emailCliente', sql.VarChar(200), emailCliente)
                .input('enderecoCliente', sql.VarChar(200), enderecoCliente)
                .query(querysql);

        } catch (error) {
            console.error('Erro ao atualizar o Cliente:', error);
            throw error;
        }
    },

    //-------------------
    //DELETAR CLIENTES
    //-------------------
    /**
     * Deleta um cliente específico do banco de dados.
     * 
     * @async
     * @function deletarCliente
     * @param {*} idCliente - ID do cliente que será deletado.
     * @returns {promise<object>} Não retorna nada caso a exclusão seja bem-sucedida.
     * @throws Mostra no console o erro e propaga o erro caso a exclusão falhe.
     */

    deletarCliente: async (idCliente) => {
        try {
            const pool = await getConnection();

            const querySQL = 'DELETE FROM  Clientes WHERE idCliente=@idCliente';

            await pool.request()
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .query(querySQL);



            return result;
        } catch (error) {
            console.error('Erro ao deletar o Cliente:', error);
            throw error;
        }
    }
}

module.exports = { clienteModel };