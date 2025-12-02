# API Reference 

### MODELO ENTIDADE RELACIONAMENTO
![MODELO ENTIDADE RELACIONAMENTO](./image%20(4).png)

### Clientes

#### GET /clientes
- **Descrição**: Listar um ou mais clientes
- **Response**: Array de clientes
- **função**: /clientes/idcliente

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

### Pedidos

#### GET /pedidos
- **Descrição**: Listar um ou mais pedidos
- **Response**: Array de pedidos

#### POST /pedidos
- **Descrição**: Cria um novo pedido
- **Body**: 
```
{
	"idCliente": "DD485012-11AE-44CD-8472-EC9787290D3E",
	"dataPedido": "2025-11-18",
	"tipoEntrega": "NORMAL", 
	"distanciaKM": 50.00, 
	"pesoDaCarga": 10.00, 
	"valorBaseKM": 5.00, 
	"valorBaseKG": 2.00 
	
}
```
- **Response**: 
```
{
	"message": "Pedido cadastrado com sucesso!"
}
```

#### PUT /pedidos
- **Descrição**: Atualiza os dados do pedido
- **Body**: 
```
{
	
	"tipoEntrega": "URGENTE",
	"distanciaKM": 60
	
}
```
- **Response**: 
```
{
	"mensagem": "Pedido atualizado com sucesso"
}
```

### Entregas

#### GET /entregas
- **Descrição**: Listar uma ou mais entrega
- **Response**: Array de entregas