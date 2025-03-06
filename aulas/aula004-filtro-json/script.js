//Importando os modulos do Node.js
const fs = require('fs');
const path = require('path');
const express = require('express')

//Criar uma instancia de servidor usando Express
const app = express();

//Configurando porta em que o servidor irá escutar
const port = 3000;

//Caminho do arquivo JSON que contem os dados dos carros
const carrosPath = path.join(__dirname, 'carros_classicos.json');

//Lendo e convertendo os dados do arquico  JSON en um ibjeto JS
const carrosData = fs.readFileSync(carrosPath, 'utf-8');
const carros = JSON.parse(carrosData);

//Função para nuscar um carro especifico pelo nome
function buscarCarroPorNome(){
    //Utilizando o metodo 'FIND' para procurar un carro com o nome correspondente no array
    return carros.find(carros =>
        carros.nome.toLowerCase() === nome.toLowerCase()
    );
}

//Rota para buscar e exibir um carro pelo nome
app.get('/buscar-carro/:nome',(req, res) => {
    //Obtendo o nome do carro  a ser buscado a partir da URl
    const nomeDoCarroBuscado = req.params.nome;

    //chamando a função para buscar o carro pelo nome
    const carroEncontrado = buscarCarroPorNome(nomeDoCarroBuscado);

    //Verificando se o carro foi encontrado
    if (carroEncontrado) {
        res.send(`<h1>Carro encontrado</h1><pre>${JSON.stringify(carroEncontrado,null,2)}</pre>`);
    }
    else{
        //enciando uma resposta indicando q o carro n foi encontrada
        res.send('<h1>Carro não encontrado</h1>');
    }
})

app.listen(port, () => {
        console.log(`Servidor iniciado em http://localhost:${port}`);
    })