const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'trabalho.json');

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

// Rota GET /trabalho - Listar todos ou filtrar por titulo ou disciplina
app.get('/trabalho', (req, res) => {
    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler os dados.');
        }

        const trabalhos = JSON.parse(data);
        const { titulo, disciplina } = req.query;

        if (titulo) {
            const filtrado = trabalhos.filter(t =>
                t.titulo.toLowerCase() === titulo.toLowerCase()
            );
            return res.json(filtrado);
        }

        if (disciplina) {
            const filtrado = trabalhos.filter(t =>
                t.disciplina.toLowerCase() === disciplina.toLowerCase()
            );
            return res.json(filtrado);
        }

        res.json(trabalhos);
    });
});

// Rota POST /excluir-trabalho
app.post('/excluir-trabalho', (req, res) => {
    const { titulo } = req.body;

    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler os dados.');
        }

        let trabalhos = JSON.parse(data);
        const index = trabalhos.findIndex(t => t.titulo.toLowerCase() === titulo.toLowerCase());

        if (index === -1) {
            return res.send(`<h1>Trabalho "${titulo}" não encontrado.</h1><a href="/">Voltar</a>`);
        }

        // Remove o campeão e salva o novo JSON
        trabalhos.splice(index, 1);

        fs.writeFile(DATA_FILE, JSON.stringify(trabalhos, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar os dados.');
            }

            res.send(`
                <h1>Trabalho "${titulo}" excluído com sucesso!</h1>
                <a href="/">Voltar</a>
            `);
        });
    });
});

// Rota POST /adicionar-trabalho
app.post('/adicionar-trabalho', (req, res) => {
    const novoTrabalho = req.body;

    // Verifica se os campos obrigatórios foram enviados
    if (!novoTrabalho.titulo || !novoTrabalho.descricao || !novoTrabalho.disciplina) {
        return res.status(400).send('Por favor, envie título, descrição e disciplina do trabalho.');
    }

    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler os dados.');
        }

        const trabalhos = JSON.parse(data);

        // Verifica se o trabalho já existe (pelo titulo)
        const jaExiste = trabalhos.some(c =>
            c.titulo.toLowerCase() === novoTrabalho.titulo.toLowerCase()
        );

        if (jaExiste) {
            return res.send(`<h1>O trabalho "${novoTrabalho.titulo}" já existe.</h1><a href="/">Voltar</a>`);
        }

        trabalhos.push(novoTrabalho);

        fs.writeFile(DATA_FILE, JSON.stringify(trabalhos, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar os dados.');
            }

            res.send(`
                <h1>Trabalho "${novoTrabalho.titulo}" adicionado com sucesso!</h1>
                <a href="/">Voltar</a>
            `);
        });
    });
});

// Rota POST /atualizar-trabalho
app.post('/atualizar-trabalho', (req, res) => {
    const { titulo, descricao, disciplina } = req.body;

    if (!titulo || !descricao || !disciplina) {
        return res.status(400).send('Por favor, envie titulo, descrição e disciplina do campeão.');
    }

    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler os dados.');
        }

        let trabalhos = JSON.parse(data);
        const index = trabalhos.findIndex(t => t.titulo.toLowerCase() === titulo.toLowerCase());

        if (index === -1) {
            return res.send(`<h1>Trabalho "${titulo}" não encontrado.</h1><a href="/">Voltar</a>`);
        }

        // Atualiza os dados
        trabalhos[index].descricao = descricao;
        trabalhos[index].disciplina = disciplina;

        fs.writeFile(DATA_FILE, JSON.stringify(trabalhos, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar os dados.');
            }

            res.send(`<h1>Trabalho "${titulo}" atualizado com sucesso!</h1><a href="/">Voltar</a>`);
        });
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
