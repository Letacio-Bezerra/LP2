const fs = require('fs');
const path = require('path');
const express = require = require('express');
const app = express();

const port = 3001;

const carrosPath = path.join(__dirname, 'carros.json');
const carrosData = fs.readFileSync(carrosPath, 'utf-8');
const carros = JSON.parse(carrosData);

//Função para truncar a descrição
function truncarDescricao(descrição, comprimentoMaximo){
    if (descrição.lenght > comprimentoMaximo){
        return truncarDescricao.slice(0, comprimentoMaximo) + '...';
    }
return descrição;
}

//Criando Tabela
app.get('/', (req, res) => {
    let carsTable = '';

    carros.forEach(carro => {
        //Limitando a descrição a 100 caracteres
        const descricaoTruncada = truncarDescricao(carro.desc, 100);

        carsTable += `
        <tr>
            <td><a href="${carro.url_info}">${carro.nome}</a><td>
            <td>${descricaoTruncada}</td>
            <td><img src="${carro.url_foto}" alt="${carro.nome}" style="max-width: 100px;"></td>
        </tr>
        `;
    });

    const htmlContent = fs.readFileSync('dadoscarro.html', 'utf-8');
    const finalHtml = htmlContent.replace('{{carsTable}}', carsTable);

    res.send(finalHtml);
})
app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});