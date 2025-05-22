const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const port = 3001;

const carrosPath = path.join(__dirname, 'lol.json');
const carrosData = fs.readFileSync(carrosPath, 'utf-8');
const carros = JSON.parse(carrosData);

app.use(express.json());

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

app.get('/', (req, res) => {
    res.send(`
        <h1>LoL - Nome e Lore</h1>
        <p>Endpoints disponíveis:</p>
        <ul>
            <li><strong>/lol</strong> - Listar todos os campeões</li>
            <li><strong>/lol?category=lore</strong> - Filtrar por nome</li>
        </ul>
    `);
});

// Rota GET /articles
app.get('/lol', (req, res) => {
    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler os dados.');
        }

        const articles = JSON.parse(data);
        const category = req.query.category;

        // Filtro por categoria
        if (category) {
            const filtered = articles.filter(article => 
                article.categoria.toLowerCase() === category.toLowerCase()
            );
            return res.json(filtered);
        }

        res.json(articles);
    });
});

// Rota POST /articles
app.post('/articles', (req, res) => {
    const newArticle = req.body;

    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler os dados.');
        }

        const articles = JSON.parse(data);
        articles.push(newArticle);

        fs.writeFile(DATA_FILE, JSON.stringify(articles, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar os dados.');
            }
            res.status(201).json({ message: 'Artigo adicionado!' });
        });
    });
});

// Inicia servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});