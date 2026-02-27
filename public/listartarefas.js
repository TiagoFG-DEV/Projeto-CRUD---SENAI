document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('#tabelatarefas tbody');
    const formEdit = document.getElementById('formularioEdicao');
    const fEdit = document.getElementById('formEditarTarefa');

    function load() {
        fetch('/api/tarefas').then(r => r.json()).then(d => {
            tbody.innerHTML = '';
            if (d.tarefas.length) {
                d.tarefas.forEach(t => {
                    let tr = document.createElement('tr');
                    tr.innerHTML = `<td>${t.nome}</td>
                    <td>${t.descricao}</td>
                    <td>${t.data_entrega}</td>
                    <td>${t.responsavel}</td>
                    <td>${t.status}</td>
                    <td>
                        <button class='edit'>Editar</button>
                        <button class='delete'>Deletar</button>
                    </td>`;

                    tr.querySelector('.edit').addEventListener('click', () => openEdit(t));
                    tr.querySelector('.delete').addEventListener('click', () => del(t.id));
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan=6>No tasks</td></tr>';
            }
        });
    }

    function openEdit(t) {
        formEdit.style.display = 'block';
        document.getElementById('tarefaId').value = t.id;
        document.getElementById('editarNome').value = t.nome;
        document.getElementById('editarDescricao').value = t.descricao;
        document.getElementById('editarDataEntrega').value = t.data_entrega;

        fetch('/api/responsaveis').then(r => r.json()).then(d => {
            let sel = document.getElementById('editarResponsavel');
            sel.innerHTML = '';
            d.responsaveis.forEach(rp => {
                let opt = document.createElement('option');
                opt.value = rp.id;
                opt.textContent = rp.nome;
                if (rp.nome == t.responsavel) opt.selected = true;
                sel.appendChild(opt);
            });
        });
        document.getElementById('editarStatus').value = t.status;
    }

    document.getElementById('cancelarEdicao').addEventListener('click', () => {
        formEdit.style.display = 'none';
    });

    fEdit.addEventListener('submit', e => {
        e.preventDefault();
        let id = document.getElementById('tarefaId').value;
        let nome = document.getElementById('editarNome').value;
        let desc = document.getElementById('editarDescricao').value;
        let data = document.getElementById('editarDataEntrega').value;
        let resp = document.getElementById('editarResponsavel').value;
        let st = document.getElementById('editarStatus').value;

        fetch(`/api/tarefas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: nome, descricao: desc, data_entrega: data, responsavel_id: resp, status: st })
        }).then(r => r.json()).then(() => {
            formEdit.style.display = 'none';
            load();
        });
    });

    window.del = function (id) {
        if (confirm('Delete?')) {
            fetch(`/api/tarefas/${id}`, { method: 'DELETE' })
                .then(r => r.json())
                .then(() => load());
        }
    };

    load();
});