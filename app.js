import { createServer } from 'http';
import { readFileSync, writeFile, readFile } from 'fs';

function lerDados() {
    return readFileSync('db.json', 'utf-8');
}

function salvarDados(dados) {
    writeFileSync('db.json', JSON.stringify(dados, null, 2));
}

const server = createServer((req, res) => {
    const { url, method } = req;

    if (url === '/api/produtos' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(lerDados());
        res.end();
    } else if (url === '/api/produtos' && method === 'POST') {
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
    } else if (url === '/' && method === 'GET') {
        readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.write('Internal Server Error');
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                res.end();
            }
        }); 
    } else if (url === '/assets/produto.png' && method === 'GET') {
        readFile('assets/produto.png', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.write('Internal Server Error');
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'image/png' });
                res.write(data);
                res.end();
            }
        });
     } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Not Found');
        res.end();
    }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});