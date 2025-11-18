# API Reference 

### Clientes

#### GET /clientes
- **Descrição**: Listar um ou mais clientes
- **Response**: Array de clientes

#### POST /clientes
- **Descrição**: Cria um novo cliente
- **Body**: 
```
{
    
  "nomeCliente": "João Silva",
  "cpfCliente": "12345678901",
  "telefoneCliente": "11987654321",
  "emailCliente": "joao.silva@gmail.com",
  "enderecoCliente": "Rua das Flores, 123  São Paulo"

}
```
- **Response**: 
```
{
	"message": "Cliente cadastrado com sucesso!"
}
```

#### PUT /clientes
- **Descrição**: Atualiza os dados do cliente
- **Body**: 
```
{ 
	"nomeCliente": "Carlos",
	"emailCliente": "carlos@gmail.com"
}
```
- **Response**: 
```
{
	"message": "Cliente atualizado com sucesso"
}
```

#### DELETE /clientes
- **Descrição**: Deleta um cliente
- **Response**: 
```
{
	"message": "cliente deletado com sucesso"
}
```

