const { pool } = require("mssql");
const { clienteModel } = require("../models/clienteModel");

const clienteController = {
    //-----------------
    //LISTAR CLIENTES
    //GET /clientes
    //-----------------
    listarClientes: async (req, res) => {
        try {
            const { idCliente } = req.query;

            //para listar um unico cliente pelo id
            if (idCliente) {

                if (idCliente.length != 36) {
                    return res.status(400).json({ erro: 'Id do cliente inválido!' });
                }

                let cliente = await clienteModel.buscarUm(idCliente);
                res.status(200).json(cliente);

            }

            //para listar todos os clientes
            const clientes = await clienteModel.buscarTodos();

            res.status(200).json(clientes)

        } catch (error) {
            console.error('Erro ao listar todos os clientes', error);
            throw error;
        }
    },


    //----------------
    // CRIAR CLIENTES
    // POST /clientes
    //----------------
    criarCliente: async (req, res) => {
        try {

            const { nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente } = req.body;

            if (nomeCliente == undefined || cpfCliente == undefined || telefoneCliente == undefined || emailCliente == undefined || enderecoCliente == undefined) {
                return res.status(400).json({ erro: 'Campos obrigatorios não preenchidos!' });
            }

            await clienteModel.inserirCliente(nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente);

            res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });

        } catch (error) {
            console.error('Erro ao cadastrar Cliente', error);
            res.status(500).json({ erro: 'Erro no servidor ao cadastrar Cliente!' });
        }
    },

    //--------------------
    // ATUALIZAR CLIENTES
    // POST /clientes
    //--------------------
    atualizarCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const { nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente } = req.body;
    
            if (idCliente.length != 36) {
                return res.status(400).json({ erro: 'Id do cliente inválido!' });
            }
    
            const cliente = await clienteModel.buscarUm(idCliente);
            if (!cliente || cliente.length !== 1) {
                return res.status(404).json({erro: 'Cliente não encontrado'});
            }
    
            const clienteAtual = cliente[0];
    
            const nomeAtualizado= nomeCliente ?? clienteAtual.nomeCliente;
            const cpfAtualizado= cpfCliente ?? clienteAtual.cpfCliente;
            const telefoneAtualizado= telefoneCliente ?? clienteAtual.telefoneCliente;
            const emailAtualizado= emailCliente ?? clienteAtual.emailCliente;
            const enderecoAtualizado= enderecoCliente ?? clienteAtual.enderecoCliente;
    
            await clienteModel.atualizarCliente(idCliente, nomeAtualizado, cpfAtualizado, telefoneAtualizado, emailAtualizado, enderecoAtualizado);
            res.status(200).json({message: 'Cliente atualizado com sucesso'});
            
        } catch (error) {
            console.error('Erro ao atualizar o cliente');
            res.status(500).json({erro: 'Erro no servidor ao atualizar os dados do cliente!'});
        }
    },

    //--------------------
    // DELETAR CLIENTES
    // DELETE /clientes
    //--------------------
    deletarCliente: async (req, res) => {
        try {
            
            const {idCliente} = req.params;

            const cliente = await clienteModel.buscarUm(idCliente);
            console.log(cliente);
            

            if (cliente.length !== 1) {
                return res.status(404).json({erro:'cliente não encontrado'});
            }

            await clienteModel.deletarCliente(idCliente);

            res.status(200).json({message: "cliente deletado com sucesso"});
        } catch (error) {
            console.error('Erro ao deletar o cliente:',error);
            res.status(500).json({erro: "Erro no servidor ao deletar o cliente"});
        }
    }

}

module.exports = { clienteController };