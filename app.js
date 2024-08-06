import { createServer } from 'http';
import { readFileSync, writeFileSync, readFile } from 'fs';

function lerDados() {
    return readFileSync('db.json', 'utf-8');
}

function salvarDados(dados) {
    writeFileSync('db.json', JSON.stringify(dados, null, 2));
}

function handleGetProdutos(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(lerDados());
    res.end();
}

function handlePostProdutos(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });
    req.on('end', () => {
        const dados = JSON.parse(body);
        const produtos = JSON.parse(lerDados());
        produtos.push(dados);
        salvarDados(produtos);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.write(lerDados());
        res.end();
    });
}

function handleGetIndex(req, res) {
    readFile('index.html', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write('Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
        }
        res.end();
    });
}

function handleGetProdutoImage(req, res) {
    readFile('assets/produto.png', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write('Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.write(data);
        }
        res.end();
    });
}

const server = createServer((req, res) => {
    const { url, method } = req;

    switch (url) {
        case '/api/produtos':
            if (method === 'GET') {
                handleGetProdutos(req, res);
            } else if (method === 'POST') {
                handlePostProdutos(req, res);
            } else {
                res.writeHead(405, { 'Content-Type': 'text/plain' });
                res.write('Method Not Allowed');
                res.end();
            }
            break;
        case '/':
            if (method === 'GET') {
                handleGetIndex(req, res);
            } else {
                res.writeHead(405, { 'Content-Type': 'text/plain' });
                res.write('Method Not Allowed');
                res.end();
            }
            break;
        case '/assets/produto.png':
            if (method === 'GET') {
                handleGetProdutoImage(req, res);
            } else {
                res.writeHead(405, { 'Content-Type': 'text/plain' });
                res.write('Method Not Allowed');
                res.end();
            }
            break;
        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('Not Found');
            res.end();
            break;
    }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});