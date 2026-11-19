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

// ==ฝั่ง Host Export Portfolio Item JSON ====
function buildPortfolioItemFromChallenge(challengeData) {
    const today = new Date().toISOString().slice(0, 10);
    const idBase = (challengeData && challengeData.id ? challengeData.id : 'item')
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, '-');
    return {
        id: `${idBase}-${today}`,
        title: challengeData?.title || 'Challenge Submission',
        type: 'Challenge',
        date: today,
        role: 'Participant',
        description: challengeData?.description || '',
        skills: Array.isArray(challengeData?.tags) ? challengeData.tags : [],
        reflection: {
            whatIDid: '',
            whatILearned: '',
            challenge: '',
            nextStep: ''
        },
        evidence: []
    };
}

let latestHostItemJson = '';

function syncHostItemJson(challengeData = sampleChallenge) {
    latestHostItemJson = JSON.stringify(buildPortfolioItemFromChallenge(challengeData), null, 2);
}

const originalDisplayChallenge = typeof displayChallenge === 'function' ? displayChallenge : null;
if (originalDisplayChallenge) {
    displayChallenge = function (data) {
        originalDisplayChallenge(data);
        syncHostItemJson(data);
    };
}
syncHostItemJson(sampleChallenge);

function triggerJsonDownload(filename, obj) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

const hostCopyBtn = document.querySelector('#host-copy-item-btn');
if (hostCopyBtn) {
    hostCopyBtn.addEventListener('click', async () => {
        const msg = document.querySelector('#host-item-msg');
        try {
            await navigator.clipboard.writeText(latestHostItemJson);
            if (msg) {
                msg.textContent = 'Copied portfolio-item JSON!';
                msg.className = 'small mt-2 mb-0 text-success';
            }
        } catch {
            if (msg) {
                msg.textContent = 'Could not copy automatically.';
                msg.className = 'small mt-2 mb-0 text-danger';
            }
        }
    });
}

const hostDownloadBtn = document.querySelector('#host-download-item-btn');
if (hostDownloadBtn) {
    hostDownloadBtn.addEventListener('click', () => {
        const msg = document.querySelector('#host-item-msg');
        try {
            const parsed = JSON.parse(latestHostItemJson);
            triggerJsonDownload('portfolio-item.json', parsed);
            if (msg) {
                msg.textContent = 'Downloaded portfolio-item.json!';
                msg.className = 'small mt-2 mb-0 text-success';
            }
        } catch (err) {
            if (msg) {
                msg.textContent = err.message;
                msg.className = 'small mt-2 mb-0 text-danger';
            }
        }
    });
}

// ==== นี Tester Import ===
function syncTesterPortfolioSelect() {
    const select = document.querySelector('#tester-target-portfolio');
    if (!select) return;
    select.innerHTML = '';
    for (const p of portfolios) {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.displayName} (${p.items.length} items)`;
        if (p.id === selectedId) opt.selected = true;
        select.appendChild(opt);
    }
}

const origShowList = showPortfolioList;
showPortfolioList = function () {
    origShowList();
    syncTesterPortfolioSelect();
};

function setImportStatus(text, isError = false) {
    const el = document.querySelector('#import-item-status');
    if (!el) return;
    el.textContent = text;
    el.className = isError ? 'small mb-2 text-danger' : 'small mb-2 text-success';
}

function isDuplicateItemId(targetPortfolioId, itemId) {
    if (!itemId) return false;
    const target = portfolios.find(p => p.id === targetPortfolioId);
    if (!target || !Array.isArray(target.items)) return false;
    return target.items.some(existing => String(existing.id) === String(itemId));
}

function populateTesterForm(rawObj) {
    const ref = (rawObj.reflection && typeof rawObj.reflection === 'object') ? rawObj.reflection : {};
    const skillsArr = Array.isArray(rawObj.skills) ? rawObj.skills : [];
    const evArr = Array.isArray(rawObj.evidence) ? rawObj.evidence : (rawObj.evidence ? [rawObj.evidence] : []);

    document.querySelector('#tester-item-id').value = rawObj.id || '';
    document.querySelector('#tester-item-title').value = rawObj.title || '';
    document.querySelector('#tester-item-type').value = rawObj.type || 'Challenge';
    document.querySelector('#tester-item-date').value = rawObj.date || new Date().toISOString().slice(0, 10);
    document.querySelector('#tester-item-role').value = rawObj.role || 'Tester';
    document.querySelector('#tester-item-desc').value = rawObj.description || '';
    document.querySelector('#tester-item-skills').value = skillsArr.join(', ');
    document.querySelector('#ref-what-i-did').value = ref.whatIDid || '';
    document.querySelector('#ref-what-i-learned').value = ref.whatILearned || '';
    document.querySelector('#ref-challenge').value = ref.challenge || '';
    document.querySelector('#ref-next-step').value = ref.nextStep || '';
    document.querySelector('#tester-item-evidence').value = evArr[0] || '';
}

function loadJsonStringIntoTester(jsonStr) {
    const data = JSON.parse(jsonStr);
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('JSON must be a Portfolio Item object.');
    }
    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
        throw new Error('Missing or invalid "title" field in Portfolio Item JSON.');
    }

    const targetId = document.querySelector('#tester-target-portfolio')?.value || selectedId;
    if (data.id && isDuplicateItemId(targetId, data.id)) {
        throw new Error(`Duplicate item ID "${data.id}" in the selected portfolio. Change the ID before saving.`);
    }

    populateTesterForm(data);
    setImportStatus('JSON validated. Edit reflection & evidence, then click "Save Item to Server".', false);
}

const parseImportBtn = document.querySelector('#parse-import-item-btn');
if (parseImportBtn) {
    parseImportBtn.addEventListener('click', () => {
        const rawText = document.querySelector('#import-item-textarea')?.value.trim() || '';
        if (!rawText) {
            setImportStatus('Please paste Portfolio Item JSON or upload a .json file first.', true);
            return;
        }
        try {
            loadJsonStringIntoTester(rawText);
        } catch (err) {
            setImportStatus(err.message, true);
        }
    });
}

const importFileInput = document.querySelector('#import-item-file');
if (importFileInput) {
    importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = String(ev.target.result || '');
            const ta = document.querySelector('#import-item-textarea');
            if (ta) ta.value = text;
            try {
                loadJsonStringIntoTester(text);
            } catch (err) {
                setImportStatus(err.message, true);
            }
        };
        reader.readAsText(file);
    });
}

const testerSaveForm = document.querySelector('#tester-save-item-form');
if (testerSaveForm) {
    testerSaveForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const targetPortfolioId = document.querySelector('#tester-target-portfolio')?.value || selectedId;
        if (!targetPortfolioId) {
            setImportStatus('Please create or select a target Portfolio first.', true);
            return;
        }

        const itemId = val('#tester-item-id');
        const title = val('#tester-item-title');
        const evidenceUrl = val('#tester-item-evidence');
        const whatIDid = val('#ref-what-i-did');
        const whatILearned = val('#ref-what-i-learned');
        const challengeRef = val('#ref-challenge');
        const nextStep = val('#ref-next-step');

        if (!title) {
            setImportStatus('Title is required.', true);
            return;
        }
        if (!whatIDid || !whatILearned || !challengeRef || !nextStep) {
            setImportStatus('Please fill all 4 reflection fields.', true);
            return;
        }
        if (!evidenceUrl) {
            setImportStatus('Please provide at least one Evidence URL.', true);
            return;
        }
        if (isDuplicateItemId(targetPortfolioId, itemId)) {
            setImportStatus(`Item ID "${itemId}" already exists in this portfolio.`, true);
            return;
        }

        const formData = new FormData();
        formData.append('portfolioId', targetPortfolioId);
        formData.append('title', title);
        formData.append('type', val('#tester-item-type') || 'Challenge');
        formData.append('date', val('#tester-item-date') || new Date().toISOString().slice(0, 10));
        formData.append('role', val('#tester-item-role') || 'Tester');
        formData.append('description', val('#tester-item-desc'));
        formData.append('skills', val('#tester-item-skills'));
        formData.append('whatIDid', whatIDid);
        formData.append('whatILearned', whatILearned);
        formData.append('challenge', challengeRef);
        formData.append('nextStep', nextStep);
        formData.append('evidence', evidenceUrl);

        try {
            await postForm('api/items.php', formData);
            await loadPortfolios();
            selectedId = targetPortfolioId;
            showPortfolioList();
            showPortfolio1();
            setImportStatus(`Saved "${title}" to server successfully.`, false);
            testerSaveForm.reset();
        } catch (err) {
            setImportStatus(err.message, true);
        }
    });
}

const exportMyPortfolioBtn = document.querySelector('#export-my-portfolio-btn');
if (exportMyPortfolioBtn) {
    exportMyPortfolioBtn.addEventListener('click', () => {
        const msg = document.querySelector('#export-my-portfolio-msg');
        const current = portfolios.find(p => p.id === selectedId);
        if (!current) {
            if (msg) {
                msg.textContent = 'Please select your Portfolio first.';
                msg.className = 'small mt-2 mb-0 text-danger';
            }
            return;
        }
        triggerJsonDownload('my-portfolio.json', current);
        if (msg) {
            msg.textContent = `Exported "${current.displayName}" to my-portfolio.json!`;
            msg.className = 'small mt-2 mb-0 text-success';
        }
    });
} 