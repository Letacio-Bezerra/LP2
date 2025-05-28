const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'lol.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializa o arquivo JSON se não existir
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

// Rota principal que envia o HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota GET /lol - Listar todos ou filtrar por nome ou região
app.get('/lol', (req, res) => {
    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler os dados.');
        }

        const campeoes = JSON.parse(data);
        const { nome, regiao } = req.query;

        if (nome) {
            const filtrado = campeoes.filter(c =>
                c.nome.toLowerCase() === nome.toLowerCase()
            );
            return res.json(filtrado);
        }

        if (regiao) {
            const filtrado = campeoes.filter(c =>
                c.regiao.toLowerCase() === regiao.toLowerCase()
            );
            return res.json(filtrado);
        }

        res.json(campeoes);
    });
});

// Rota POST /excluir-champ
app.post('/excluir-champ', (req, res) => {
    const { nome } = req.body;

    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler os dados.');
        }

        let campeoes = JSON.parse(data);
        const index = campeoes.findIndex(c => c.nome.toLowerCase() === nome.toLowerCase());

        if (index === -1) {
            return res.send(`<h1>Campeão "${nome}" não encontrado.</h1><a href="/">Voltar</a>`);
        }

        // Remove o campeão e salva o novo JSON
        campeoes.splice(index, 1);

        fs.writeFile(DATA_FILE, JSON.stringify(campeoes, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar os dados.');
            }

            res.send(`
                <h1>Campeão "${nome}" excluído com sucesso!</h1>
                <a href="/">Voltar</a>
            `);
        });
    });
});

// Rota POST /adicionar-champ
app.post('/adicionar-champ', (req, res) => {
    const novoCampeao = req.body;

    // Verifica se os campos obrigatórios foram enviados
    if (!novoCampeao.nome || !novoCampeao.regiao || !novoCampeao.lore) {
        return res.status(400).send('Por favor, envie nome, regiao e lore do campeão.');
    }

    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler os dados.');
        }

        const campeoes = JSON.parse(data);

        // Verifica se o campeão já existe (pelo nome)
        const jaExiste = campeoes.some(c =>
            c.nome.toLowerCase() === novoCampeao.nome.toLowerCase()
        );

        if (jaExiste) {
            return res.send(`<h1>O campeão "${novoCampeao.nome}" já existe.</h1><a href="/">Voltar</a>`);
        }

        campeoes.push(novoCampeao);

        fs.writeFile(DATA_FILE, JSON.stringify(campeoes, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar os dados.');
            }

            res.send(`
                <h1>Campeão "${novoCampeao.nome}" adicionado com sucesso!</h1>
                <a href="/">Voltar</a>
            `);
        });
    });
});

// Rota POST /atualizar-champ
app.post('/atualizar-champ', (req, res) => {
    const { nome, regiao, lore } = req.body;

    if (!nome || !regiao || !lore) {
        return res.status(400).send('Por favor, envie nome, regiao e lore do campeão.');
    }

    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler os dados.');
        }

        let campeoes = JSON.parse(data);
        const index = campeoes.findIndex(c => c.nome.toLowerCase() === nome.toLowerCase());

        if (index === -1) {
            return res.send(`<h1>Campeão "${nome}" não encontrado.</h1><a href="/">Voltar</a>`);
        }

        // Atualiza os dados
        campeoes[index].regiao = regiao;
        campeoes[index].lore = lore;

        fs.writeFile(DATA_FILE, JSON.stringify(campeoes, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar os dados.');
            }

            res.send(`<h1>Campeão "${nome}" atualizado com sucesso!</h1><a href="/">Voltar</a>`);
        });
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
