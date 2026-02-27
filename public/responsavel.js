document.addEventListener('DOMContentLoaded', () => {
    const sel = document.getElementById('responsavel');
    fetch('/api/responsaveis').then(r => r.json()).then(d => {
        sel.innerHTML = '<option value="">Selecione</option>';
        d.responsaveis.forEach(rp => {
            let opt = document.createElement('option');
            opt.value = rp.id;
            opt.textContent = rp.nome;
            sel.appendChild(opt);
        });
    });
});