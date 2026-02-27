const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3030;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => res.redirect('/tarefas'));
app.get('/tarefas', (req, res) => res.sendFile(path.join(__dirname, 'public', 'tarefa.html')));
app.get('/responsaveis', (req, res) => res.sendFile(path.join(__dirname, 'public', 'responsavel.html')));
app.get('/listartarefas', (req, res) => res.sendFile(path.join(__dirname, 'public', 'listartarefas.html')));
app.get('/api/responsaveis', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'responsaveis.json'), 'utf8', (err, data) => {
        if (err) return res.json({ success: false });
        const resp = JSON.parse(data || '[]');
        res.json({ success: true, responsaveis: resp });
    });
});

app.post('/Cadresponsaveis', (req, res) => {
    const { nome, email } = req.body;
    const file = path.join(__dirname, 'data', 'responsaveis.json');
    fs.readFile(file, 'utf8', (err, data) => {
        const arr = JSON.parse(data || '[]');
        arr.push({ id: Date.now(), nome, email: email || '' });
        fs.writeFile(file, JSON.stringify(arr, null, 2), () => res.redirect('/tarefas'));
    });
});

app.get('/api/tarefas', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'tarefas.json'), 'utf8', (err, data) => {
        if (err) return res.json({ sucess: false });
        const arr = JSON.parse(data || '[]');
        res.json({ sucess: true, tarefas: arr });
    });
});

app.post('/tarefas', (req, res) => {
    const { nome, descricao, data_entrega, responsavel_id, status } = req.body;
    const fileT = path.join(__dirname, 'data', 'tarefas.json');
    const fileR = path.join(__dirname, 'data', 'responsaveis.json');
    fs.readFile(fileR, 'utf8', (e, d) => {
        const respArr = JSON.parse(d || '[]');
        const resp = respArr.find(r => r.id == responsavel_id);
        fs.readFile(fileT, 'utf8', (e2, d2) => {
            const arr2 = JSON.parse(d2 || '[]');
            arr2.push({ id: Date.now(), nome, descricao, data_entrega, responsavel: resp ? resp.nome : 'Desconhecido', status });
            fs.writeFile(fileT, JSON.stringify(arr2, null, 2), () => res.redirect('/listartarefas'));
        });
    });
});

app.put('/api/tarefas/:id', (req, res) => {
    const id = req.params.id;
    const { nome, descricao, data_entrega, responsavel_id, status } = req.body;
    const fileT = path.join(__dirname, 'data', 'tarefas.json');
    const fileR = path.join(__dirname, 'data', 'responsaveis.json');

    fs.readFile(fileR, 'utf8', (e, d) => {
        const respArr = JSON.parse(d || '[]');
        const resp = respArr.find(r => r.id == responsavel_id);

        fs.readFile(fileT, 'utf8', (e2, d2) => {
            let arr2 = JSON.parse(d2 || '[]');
            arr2 = arr2.map(t => t.id == id ? {
                ...t, nome, descricao,data_entrega,responsavel: resp ? resp.nome : 'Desconhecido',status
            } : t);

            fs.writeFile(fileT, JSON.stringify(arr2, null, 2), () => {
                res.json({ success: true });
            });
        });
    });
});

app.delete('/api/tarefas/:id', (req, res) => {
    const id = req.params.id;
    const fileT = path.join(__dirname, 'data', 'tarefas.json');

    fs.readFile(fileT, 'utf8', (err, data) => {
        let arr = JSON.parse(data || '[]');
        arr = arr.filter(t => t.id != id);
        fs.writeFile(fileT, JSON.stringify(arr, null, 2), () => {
            res.json({ success: true });
        });
    });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));