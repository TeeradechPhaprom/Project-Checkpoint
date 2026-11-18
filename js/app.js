let portfolios = [];
let selectedId = null;

async function readJson(response) {
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch {
        throw new Error('The server did not answer with JSON (HTTP ' + response.status +
            '). Open the app via http://localhost:8000 (php -S) or http://<EC2 public IP>/ — not Live Server or GitHub Pages.');
    }
}

async function loadPortfolios() {
    const response = await fetch('api/portfolios.php');
    const result = await readJson(response);
    if (!response.ok) {
        throw new Error(result.error || 'Could not load Portfolios');
    }
    portfolios = result;
    showPortfolioList();
    showPortfolio1();
}

async function postForm(url, formData) {
    const response = await fetch(url, { method: 'POST', body: formData });
    const result = await readJson(response);
    if (!response.ok) {
        throw new Error(result.error || 'Could not save');
    }
    return result;
}

function showPortfolioList() {
    const list = document.querySelector('#portfolio-list');
    list.innerHTML = '';
    document.querySelector('#list-empty').hidden = portfolios.length > 0;
    for (const portfolio of portfolios) {
        const button = document.createElement('button');
        button.className = 'btn btn-light portfolio-btn text-start';
        if (portfolio.id === selectedId) button.classList.add('active');
        button.textContent = portfolio.displayName + ' (' + portfolio.items.length + ' items)';
        button.addEventListener('click', () => {
            selectedId = portfolio.id;
            showPortfolioList();
            showPortfolio1();
        });
        list.appendChild(button);
    }
}

function showPortfolio1() {
    const portfolio = portfolios.find(p => p.id === selectedId);
    if (!portfolio) return;
    document.querySelector('#portfolio-name-1').textContent = portfolio.displayName;
    document.querySelector('#portfolio-enjoy-1').textContent = portfolio.whatIEnjoy;
    document.querySelector('#portfolio-tried-1').textContent = portfolio.whatIveTried;
    document.querySelector('#portfolio-curious-1').textContent = portfolio.whatImCuriousAbout;

    const list = document.querySelector('#item-list');
    list.innerHTML = '';
    for (const item of portfolio.items) {
        const card = document.createElement('div');
        card.className = 'item-card rounded-3 p-3';
        const title = document.createElement('h3');
        title.className = 'h6 fw-bold mb-1';
        title.textContent = item.title + ' · ' + item.type;
        const text = document.createElement('p');
        text.className = 'small mb-1';
        text.textContent = item.description + ' --- Skills: ' + item.skills.join(', ');
        card.append(title, text);
        for (const url of item.evidence) {
            const link = document.createElement('a');
            link.href = url;
            link.textContent = url;
            link.target = '_blank';
            link.className = 'small d-block';
            card.appendChild(link);
        }
        list.appendChild(card);
    }
}

function val(selector) {
    return document.querySelector(selector).value.trim();
}

document.querySelector('#profile-form-1').addEventListener('submit', async function (event) {
    event.preventDefault();
    const error = document.querySelector('#profile-error-1');
    const name = val('#displayName-1');
    if (name === '') {
        error.textContent = 'Please enter your name.';
        return;
    }
    error.textContent = '';

    const formData = new FormData();
    formData.append('displayName', name);
    formData.append('whatIEnjoy', val('#enjoy-1'));
    formData.append('whatIveTried', val('#tried-1'));
    formData.append('whatImCuriousAbout', val('#curious-1'));

    try {
        const created = await postForm('api/portfolios.php', formData);
        if (created && created.id) selectedId = created.id;
        await loadPortfolios();
    } catch (e) {
        error.textContent = e.message;
    }
});

document.querySelector('#profile-form-item-1').addEventListener('submit', async function (event) {
    event.preventDefault();
    const error = document.querySelector('#item-error-1');
    const showError = msg => error ? (error.textContent = msg) : alert(msg);
    if (error) error.textContent = '';

    if (selectedId === null) {
        showError('Please create or select a Portfolio first.');
        return;
    }

    const sets = [
        ['#Title-1',  '#Role-1',  '#Skill-1',  '#Reflection-1',  '#Evidence-1'],
    ];
    const today = new Date().toISOString().slice(0, 10);

    try {
        for (const [t, r, s, d, e] of sets) {
            const title = val(t);
            if (title === '') continue;
            const formData = new FormData();
            formData.append('portfolioId', selectedId);
            formData.append('title', title);
            formData.append('type', val(r));
            formData.append('description', val(d));
            formData.append('skills', val(s));
            formData.append('evidence', val(e));
            await postForm('api/items.php', formData);
        }
        await loadPortfolios();
    } catch (err) {
        showError(err.message);
    }
});

loadPortfolios().catch(err => console.error(err));