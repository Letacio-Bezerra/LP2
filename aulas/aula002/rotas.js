const http = require('http');

const server = http.createServer((req, res) => {
    //rota principal
    if(req.url === '/'){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Bem vindo ao meu servidor Node.js');
    }

    //rota para pagina do aluno
    else if (req.url === '/aluno') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        req.end('ALUNOS');
    }

    //rota para pagina do professor
    else if (req.url === '/professor') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        req.end('PROFESSORES');
    }
});

const port =  3000;

server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/`);
});