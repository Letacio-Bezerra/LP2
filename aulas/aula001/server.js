//importando o modulo HTTP
const http = require('http');

//Configurando as informações do servidor
const hostname = '127.0.0.1';
const port = 3000;

//criando o servidor usando uma função com nome diferente
const meuServidor = http.createServer((req, res) => {
    //configurando o cabeçalho da resposta
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    //Enviando mensagem de resposta
    res.end('Bem-vindo ao meu servidor Node.js!\n');
});

//Iniciando o servidor e executando a porta especificada
meuServidor.listen(port, hostname, () => {
    console.log(`Servidor rodando em http://${hostname}:${port}/`);
});