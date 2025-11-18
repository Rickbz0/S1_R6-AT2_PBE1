const { UniqueIdentifier } = require("mssql");
const { sql, getConnection } = require("../config/db");

const clienteModel = {
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

    //---------------------
    //CRIAR NOVOS CLIENTES
    //---------------------
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
    atualizarCliente: async (idCliente, nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente) => {
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
    },

    //-------------------
    //DELETAR CLIENTES
    //-------------------
    deletarCliente: async (idCliente)=>{
        try {
            const pool = await getConnection();

            const querySQL = 'DELETE FROM  Clientes WHERE idCliente=@idCliente';

            await pool.request()
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .query(querySQL);
        } catch (error) {
            console.error('Erro ao deletar o Cliente:',error);
            throw error;
        }
    }
}

module.exports = { clienteModel };