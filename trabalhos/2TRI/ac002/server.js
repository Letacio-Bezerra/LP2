const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

const DATA_FILE = path.join(__dirname, 'trabalho.json');

function truncarDescricao(descricao, comprimentoMaximo) {
    if (descricao.length > comprimentoMaximo) {
        return descricao.slice(0, comprimentoMaximo) + '...';
    }
    return descricao;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializa o arquivo JSON se não existir
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

// Rota principal que envia o HTML
app.get('/', (req, res) => {
    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao carregar os trabalhos.');
        }

        const trabalhos = JSON.parse(data);
        let tabela = '';

        trabalhos.forEach(trabalho => {
            const descricaoTruncada = truncarDescricao(trabalho.descricao, 100);

            tabela += `
                <tr>
                    <td>${trabalho.titulo}</td>
                    <td>${descricaoTruncada}</td>
                    <td>${trabalho.disciplina}</td>
                <td class="d-flex gap-2">
                <form action="/editar-trabalho" method="get">
                    <input type="hidden" name="titulo" value="${trabalho.titulo}">
                    <button type="submit" class="btn btn-sm btn-primary">Editar</button>
                </form>
                <form action="/excluir-trabalho" method="post" onsubmit="return confirm('Tem certeza que deseja excluir este trabalho?')">
                    <input type="hidden" name="titulo" value="${trabalho.titulo}">
                    <button type="submit" class="btn btn-sm btn-danger">Excluir</button>
                </form>
                </td>
                </tr>
            `;
        });

        const htmlBase = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
        const paginaFinal = htmlBase.replace('{{tabelaTrabalhos}}', tabela);

        res.send(paginaFinal);
    });
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

app.get('/editar-trabalho', (req, res) => {
    const { titulo } = req.query;

    fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Erro ao ler os dados.');

        const trabalhos = JSON.parse(data);
        const trabalho = trabalhos.find(t => t.titulo.toLowerCase() === titulo.toLowerCase());

        if (!trabalho) {
            return res.send(`<h1>Trabalho "${titulo}" não encontrado.</h1><a href="/">Voltar</a>`);
        }

        res.send(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>Editar Trabalho</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            </head>
            <body class="bg-light">
                <div class="container py-5">
                    <h1 class="mb-4 text-center">Editar Trabalho</h1>
                    <form action="/atualizar-trabalho" method="post" class="card p-4 shadow-sm mx-auto" style="max-width: 600px;">
                        <input type="hidden" name="titulo" value="${trabalho.titulo}">
                        
                        <div class="mb-3">
                            <label class="form-label">Título:</label>
                            <input type="text" value="${trabalho.titulo}" class="form-control" disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Descrição:</label>
                            <input type="text" name="descricao" value="${trabalho.descricao}" class="form-control" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Disciplina:</label>
                            <input type="text" name="disciplina" value="${trabalho.disciplina}" class="form-control" required>
                        </div>

                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-warning">Salvar Alterações</button>
                            <a href="/" class="btn btn-secondary">Cancelar</a>
                        </div>
                    </form>
                </div>
            </body>
            </html>
        `);
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});