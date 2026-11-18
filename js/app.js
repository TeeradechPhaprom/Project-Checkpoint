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

const formItem2 = document.querySelector('#profile-form-item-2');
if (formItem2) {
    formItem2.addEventListener("submit", function (event) {
        event.preventDefault();
        const title1 = document.querySelector("#Title-2").value;
        const role1 = document.querySelector("#Role-2").value;
        const skill1 = document.querySelector("#Skill-2").value;
        const reflection1 = document.querySelector("#Reflection-2").value;
        const evidence1 = document.querySelector("#Evidence-2").value;
        const title2 = document.querySelector("#Title2-2").value;
        const role2 = document.querySelector("#Role2-2").value;
        const skill2 = document.querySelector("#Skill2-2").value;
        const reflection2 = document.querySelector("#Reflection2-2").value;
        const evidence2 = document.querySelector("#Evidence2-2").value;
        
        // console.log(title1);
        // console.log(role1);
        // console.log(skill1);
        // console.log(reflection1);
        // console.log(evidence1);
        // console.log(title2);
        // console.log(role2);
        // console.log(skill2);
        // console.log(reflection2);
        // console.log(evidence2);

        document.querySelector("#portfolio-Title-2").textContent = title1 || 'none';
        document.querySelector("#portfolio-Role-2").textContent = role1 || 'none';
        document.querySelector("#portfolio-Skills-2").textContent = skill1 || 'none';
        document.querySelector("#portfolio-Reflection-2").textContent = reflection1 || 'none';
        document.querySelector("#portfolio-Evidence-2").textContent = evidence1 || 'none';
        document.querySelector("#portfolio-Title2-2").textContent = title2 || 'none';
        document.querySelector("#portfolio-Role2-2").textContent = role2 || 'none';
        document.querySelector("#portfolio-Skills2-2").textContent = skill2 || 'none';
        document.querySelector("#portfolio-Reflection2-2").textContent = reflection2 || 'none';
        document.querySelector("#portfolio-Evidence2-2").textContent = evidence2 || 'none';

        const savedData = localStorage.getItem(STORAGE_KEY_2);
        let portfolioData = savedData ? JSON.parse(savedData) : {};

        portfolioData.items = [
            { title: title1, role: role1, skill: skill1, reflection: reflection1, evidence: evidence1 },
            { title: title2, role: role2, skill: skill2, reflection: reflection2, evidence: evidence2 }
        ];

        localStorage.setItem(STORAGE_KEY_2, JSON.stringify(portfolioData));
    });
}

// ชาเลนจ์ของกลุ่ม export/import

const sampleChallenge = {
    schemaVersion: "1.0",
    id: "G05-C01",
    creatorGroup: "G05",
    title: "สร้างการ์ดโปรไฟล์ส่วนตัวด้วย Bootstrap Card",
    description: "ฝึกใช้ Bootstrap Component เพื่อสร้างการ์ดแนะนำตัวสั้นๆ พร้อมตกแต่งให้สวยงาม",
    category: "discover",
    instructions: [
        "สร้างแท็ก <div class=\"card\"> ในไฟล์ HTML ของตัวเอง",
        "เพิ่มหัวข้อ h5 และข้อความแนะนำตัวสั้นๆ ด้านใน",
        "ใส่ปุ่ม Bootstrap สีเขียว (btn btn-success) สำหรับกดดูข้อมูลเพิ่มเติม"
    ],
    estimatedMinutes: 5,
    evidencePrompt: "แปะลิงก์ผลงาน",
    tags: ["html", "bootstrap", "card"]
};

function displayChallenge(data) {
    const setElemText = (id, text) => {
        const el = document.querySelector(`#${id}`);
        if (el) el.textContent = text;
    };

    setElemText('challenge-id', data.id || '-');
    setElemText('challenge-creator-group', data.creatorGroup || '-');
    setElemText('challenge-category', data.category || '-');
    setElemText('challenge-title', data.title || '-');
    setElemText('challenge-description', data.description || '-');
    setElemText('challenge-estimated-minutes', data.estimatedMinutes || 0);
    setElemText('challenge-evidence-prompt', data.evidencePrompt || 'none');

    const instructionsList = document.querySelector("#challenge-instructions");
    if (instructionsList) {
        instructionsList.innerHTML = "";
        if (Array.isArray(data.instructions)) {
            data.instructions.forEach(step => {
                const li = document.createElement("li");
                li.textContent = step;
                instructionsList.appendChild(li);
            });
        }
    }

    const tagsContainer = document.querySelector("#challenge-tags");
    if (tagsContainer) {
        tagsContainer.innerHTML = "";
        if (Array.isArray(data.tags)) {
            data.tags.forEach(tag => {
                const badge = document.createElement("span");
                badge.className = "badge bg-secondary";
                badge.textContent = tag;
                tagsContainer.appendChild(badge);
            });
        }
    }
}

displayChallenge(sampleChallenge);

const exportBtn = document.querySelector("#challenge-export-btn");
if (exportBtn) {
    exportBtn.addEventListener("click", () => {
        const jsonText = JSON.stringify(sampleChallenge, null, 2);
        const blob = new Blob([jsonText], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${sampleChallenge.id}.json`;
        link.click();

        URL.revokeObjectURL(url);

        const msg = document.querySelector("#challenge-message");
        if (msg) {
            msg.textContent = "Exported challenge successfully!";
            msg.className = "challenge-message small mt-2 mb-0 text-success";
        }
    });
}

const fileInput = document.querySelector("#challenge-file-input");
if (fileInput) {
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        const msg = document.querySelector("#challenge-message");
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                displayChallenge(data);
                if (msg) {
                    msg.textContent = `Imported "${data.title || file.name}" successfully!`;
                    msg.className = "challenge-message small mt-2 mb-0 text-success";
                }
            } catch (err) {
                if (msg) {
                    msg.textContent = "Error: Invalid JSON file format.";
                    msg.className = "challenge-message small mt-2 mb-0 text-danger";
                }
            }
        };
        reader.readAsText(file);
    });
}