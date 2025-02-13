const http = require('http')

const server = http.createServer((req, res) => {
    if (req.url === ('/')) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Clientes');
    }
    else if (req.url === ('/fornecedores')) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Fornecedores');
    }
    else if (req.url === ('/produtos')) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Produtos');
    }
    else if (req.url === ('/vendas')) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Vendas');
    }
    else if (req.url === ('/vendedores')) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Vendedores');
    }
    else{
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('ERRO 404');
    }
});

const port = 3000;

server.listen(port, () => {
    console.log(`Bem vindo servidor: http://localhost:${port}`)
})