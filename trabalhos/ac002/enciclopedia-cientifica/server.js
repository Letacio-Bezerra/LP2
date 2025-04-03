const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'articles.json');

app.use(express.json());

// Inicializa arquivo JSON se não existir
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

// Rota GET principal
app.get('/', (req, res) => {
    res.send(`
        <h1>Enciclopédia Científica - API</h1>
        <p>Endpoints disponíveis:</p>
        <ul>
            <li><strong>/articles</strong> - Listar todos os artigos</li>
            <li><strong>/articles?category=CATEGORIA</strong> - Filtrar por categoria</li>
        </ul>
    `);
});

// Rota GET /articles
app.get('/articles', (req, res) => {
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