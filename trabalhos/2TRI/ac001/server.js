const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'lol.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Criar arquivo JSON vazio se não existir
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

// Página inicial com links
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota GET - Listar ou buscar por nome ou região
app.get('/lol', (req, res) => {
    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Erro ao ler os dados.');

        const lol = JSON.parse(data);
        const { name, regiao } = req.query;

        let filtered = lol;

        if (name) {
            filtered = filtered.filter(champ => champ.nome.toLowerCase().includes(name.toLowerCase()));
        }

        if (regiao) {
            filtered = filtered.filter(champ => champ.regiao.toLowerCase().includes(regiao.toLowerCase()));
        }

        res.json(filtered);
    });
});

// Rota POST - Inserir novo registro
app.post('/lol', (req, res) => {
    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Erro ao ler os dados.');

        const champions = JSON.parse(data);
        champions.push(req.body);

        fs.writeFile(DATA_FILE, JSON.stringify(champions, null, 2), (err) => {
            if (err) return res.status(500).send('Erro ao salvar.');
            res.status(201).json({ message: 'Campeão adicionado!' });
        });
    });
});

// Rota PUT - Atualizar registro
app.put('/lol/:nome', (req, res) => {
    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Erro ao ler os dados.');

        let champions = JSON.parse(data);
        const index = champions.findIndex(champ => champ.nome === req.params.nome);

        if (index !== -1) {
            champions[index] = { ...champions[index], ...req.body };

            fs.writeFile(DATA_FILE, JSON.stringify(champions, null, 2), (err) => {
                if (err) return res.status(500).send('Erro ao salvar.');
                res.json({ message: 'Campeão atualizado!' });
            });
        } else {
            res.status(404).send('Campeão não encontrado.');
        }
    });
});

// Rota DELETE - Excluir registro
app.delete('/lol/:nome', (req, res) => {
    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Erro ao ler os dados.');

        let champions = JSON.parse(data);
        champions = champions.filter(champ => champ.nome !== req.params.nome);

        fs.writeFile(DATA_FILE, JSON.stringify(champions, null, 2), (err) => {
            if (err) return res.status(500).send('Erro ao salvar.');
            res.json({ message: 'Campeão excluído!' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
