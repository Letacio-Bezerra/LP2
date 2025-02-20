// Carrega os modulos
var http = require('http');
var url = require('url');
var fs = require('fs');

//funçaõ para ler um arquivo e escreve-lo na response
function readFile(response,file) {
    //faz a leitura do arquivo de forma assincrona
    fs.readFile(file, function(err, data){
        //quando ler, escreve na response o conteudo do arquivo JSON
        response.end(data);
    })
}

//função de callback para o servidor HTTP
function callback(request, response) {
    //cabeçalho (header) com o tiro da resposta + UTF-8 como charset
    response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
    //faz o parser da url separando o caminho (path)
    var parts = url.parse(request.url);
    var path = parts.path;
    //verifica o path
    if (path == '/carros/classicos') {
        //retorna o JSON dos carros classicos
        readFile(response,"carros_classicos.json");
    }
    else if (path == '/carros/esportivos') {
        //retorna o JSON dos carros esportivos
        readFile(response,"carros_esportivos.json");
    }
    else if (path == '/carros/luxo') {
        //retorna o JSON dos carros esportivos
        readFile(response,"carros_luxo.json");
    }
    else{
        response.end("Path não mapeado: " + path);
    }
}

//cria um servidor HTTP que vai responder "HELLO WORLD" para todas requisições
var server = http.createServer(callback);
//porta que o servidor vai escutar
server.listen(3000);
//mensagem ao iniciar o servidor
console.log("servidor iniciado em http://localhost:3000/");