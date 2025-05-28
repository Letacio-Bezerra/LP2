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
        if (err) {
            return res.status(500).send('Erro ao ler os dados.');
        }

        const lol = JSON.parse(data);
        const nome = req.query.nome;
        const regiao = req.query.regiao

        if (nome) {
            const filtered = lol.filter(champ =>
                champ.nome.toLowerCase() === nome.toLowerCase());
                 return res.json(filtered);
        }

        if (regiao) {
            filtered = lol.filter(champ => champ.regiao.toLowerCase() === regiao.toLowerCase());
            return res.json(filtered);
        }

        res.json(lol);
    });
});

//Rota para processar e excluir o champ
app.post('/excluir-champ', (req, res) => {
    const { nome } = req.body;

    let lolDate = fs.readFileSync(lolPath, 'utf-8');
    let lol = JSON.parse(lolDate);

    const lolIndex = lol.findIndex(lol => lol.nome.toLowerCase() === nome.toLowerCase());

    if (lolIndex === -1) {
        res.send('<h1>Carro não encontrado</h1>')
        return;
    }

    //Confirmação antes de excluir
    res.send(`
        <script>
            if (confirm('Tem certeza de que deseja excluir o champ ${nome}?)) {
                window.location.href = '/excluir-champ-confirmado? nome = ${nome}';
            } else {
                window.location.href = '/excluir-champ';
            }
        </script>
    `)
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
