Instale as dependências pelo terminal:
npm install express

Inicie o servidor pelo terminal:
node server.js

O servidor estará disponível em:
http://localhost:3000

Cadastrar Novo Artigo pelo terminal:
curl -X POST http://localhost:3000/articles -H "Content-Type: application/json" -d '{"titulo":"Teste","autor":"Autor","categoria":"Biologia","conteudo":"...","data":"..."}'

Listar Todos os Artigos:
http://localhost:3000/articles

Filtrar Artigos por Categoria
http://localhost:3000/articles?category=Biologia