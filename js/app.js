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
        title.textContent = item.title + ' · ' + item.type + ' · ' + item.date;
        const text = document.createElement('p');
        text.className = 'small mb-1';
        text.textContent = item.description + ' --- Skills: ' + item.skills.join(', ');
        card.append(title, text);
        for (const url of item.evidence || []) {

            // ทำเป็นลิงก์เฉพาะที่ขึ้นต้นด้วย http เพราะ JSON อาจมาจากคนอื่น
            if (url.startsWith('http://') || url.startsWith('https://')) {
                const link = document.createElement('a');
                link.href = url;
                link.textContent = url;
                link.target = '_blank';
                link.className = 'small d-block';
                card.appendChild(link);
            } else {
                const note = document.createElement('span');
                note.className = 'small d-block';
                note.textContent = url;
                card.appendChild(note);
            }
        }

        const exportItemBtn = document.createElement('button');
        exportItemBtn.type = 'button';
        exportItemBtn.className = 'btn btn-sm btn-outline-secondary mt-2';
        exportItemBtn.textContent = 'Export JSON';
        exportItemBtn.addEventListener('click', () => {
            const rawSlug = String(item.id || item.title || 'item')
                .toLowerCase()
                .replace(/[^a-z0-9-_]+/g, '-')
                .replace(/^-+|-+$/g, '');
            const safeSlug = rawSlug || 'portfolio-item';
            triggerJsonDownload(`${safeSlug}.json`, item);
        });
        card.appendChild(exportItemBtn);

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
    if (!selectedId) {
        showError('Please create or select a Portfolio first.');
        return;
    }
    try {
        const formData = new FormData(event.target);
        formData.append('portfolioId', selectedId);
        await postForm('api/items.php', formData);
        if (error) {
            error.textContent = '';
        }
        event.target.reset();
        await loadPortfolios();
    } catch (e) {
        showError(e.message);
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

// ถ้าเปิดเว็บผ่าน http (เช่น EC2) navigator.clipboard จะใช้ไม่ได้ เลยใช้วิธีเก่าแทน
async function copyText(text) {
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
    } else {
        const box = document.createElement('textarea');
        box.value = text;
        document.body.appendChild(box);
        box.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(box);
        if (!ok) {
            throw new Error('copy failed');
        }
    }
}

const hostCopyBtn = document.querySelector('#host-copy-item-btn');
if (hostCopyBtn) {
    hostCopyBtn.addEventListener('click', async () => {
        const msg = document.querySelector('#host-item-msg');
        try {
            await copyText(latestHostItemJson);
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

function syncImportPortfolioSelect() {
    const select = document.querySelector('#import-target-portfolio');
    if (!select) return;
    const currentValue = select.value;
    select.innerHTML = '<option value="">-- Choose portfolio --</option>';
    for (const p of portfolios) {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.displayName} (${p.items.length} items)`;
        if (p.id === selectedId || p.id === currentValue) opt.selected = true;
        select.appendChild(opt);
    }
}

const origShowList = showPortfolioList;
showPortfolioList = function () {
    origShowList();
    syncImportPortfolioSelect();
};

function setImportMessage(text, isError = false) {
    const el = document.querySelector('#import-message');
    if (!el) return;
    el.textContent = text;
    el.className = isError
        ? 'challenge-message small mt-2 mb-0 text-danger'
        : 'challenge-message small mt-2 mb-0 text-success';
}

function setImportSaveMessage(text, isError = false) {
    const el = document.querySelector('#import-save-message');
    if (!el) return;
    el.textContent = text;
    el.className = isError
        ? 'challenge-message small mt-2 mb-0 text-danger'
        : 'challenge-message small mt-2 mb-0 text-success';
}

function isDuplicateItemId(targetPortfolioId, itemId) {
    if (!itemId) return false;
    const target = portfolios.find(p => p.id === targetPortfolioId);
    if (!target || !Array.isArray(target.items)) return false;
    return target.items.some(existing => String(existing.id) === String(itemId));
}

function populateImportReview(rawObj) {
    // JSON ของกลุ่มอื่นอาจเขียนไม่เหมือนกัน เช่น skills เป็นข้อความเดียว เลยแปลงให้เป็นแบบเดียวกันก่อน
    let ref = rawObj.reflection;
    if (typeof ref === 'string') {
        ref = { whatIDid: ref };
    }
    if (!ref || typeof ref !== 'object') {
        ref = {};
    }

    let skillsArr = rawObj.skills;
    if (typeof skillsArr === 'string') {
        skillsArr = skillsArr.split(',');
    }
    if (!Array.isArray(skillsArr)) {
        skillsArr = [];
    }

    let evArr = rawObj.evidence;
    if (typeof evArr === 'string') {
        evArr = [evArr];
    }
    if (!Array.isArray(evArr)) {
        evArr = [];
    }

    importedItemData = {
        ...rawObj,  
        type: rawObj.type || 'Challenge',
        date: rawObj.date || new Date().toISOString().slice(0, 10),
        role: rawObj.role || 'None',
        description: rawObj.description || 'None',
        skills: skillsArr,
        evidence: evArr
    };

    const setText = (sel, value, fallback = 'none') => {
        const el = document.querySelector(sel);
        if (el) el.textContent = value || fallback;
    };

    setText('#import-title', importedItemData.title, 'Item title');
    setText('#import-type', importedItemData.type, 'Type');
    setText('#import-date', importedItemData.date, 'YYYY-MM-DD');
    setText('#import-role', importedItemData.role);
    setText('#import-description', importedItemData.description);

    const skillsEl = document.querySelector('#import-skills');
    if (skillsEl) {
        skillsEl.innerHTML = '';
        for (const sk of skillsArr) {
            const badge = document.createElement('span');
            badge.className = 'badge bg-secondary';
            badge.textContent = sk;
            skillsEl.appendChild(badge);
        }
    }

    const evEl = document.querySelector('#import-evidence');
    if (evEl) {
        evEl.innerHTML = '';
        for (const url of evArr) {
            const li = document.createElement('li');
            li.textContent = url;
            evEl.appendChild(li);
        }
    }

    document.querySelector('#import-what-i-did').value = ref.whatIDid || '';
    document.querySelector('#import-what-i-learned').value = ref.whatILearned || '';
    document.querySelector('#import-challenge').value = ref.challenge || '';
    document.querySelector('#import-next-step').value = ref.nextStep || '';
    document.querySelector('#import-evidence-input').value = '';

    syncImportPortfolioSelect();
    setImportSaveMessage('');

    const reviewBox = document.querySelector('#import-review');
    if (reviewBox) reviewBox.hidden = false;
}

// async function importPortfolioItem(rawObj) {
//     const ref = (rawObj.reflection && typeof rawObj.reflection === 'object') ? rawObj.reflection : {};
//     const skillsVal = Array.isArray(rawObj.skills) ? rawObj.skills.join(', ') : String(rawObj.skills || '');

//     const itemForm = new FormData();

//     itemForm.append('portfolioId', selectedId);
//     itemForm.append('id', String(rawObj.id || '').trim());
//     itemForm.append('title', String(rawObj.title || '').trim());
//     itemForm.append('type', String(rawObj.type || 'Challenge'));
//     itemForm.append('date', String(rawObj.date || new Date().toISOString().slice(0, 10)));
//     itemForm.append('role', String(rawObj.role || 'Tester'));
//     itemForm.append('description', String(rawObj.description || ''));
//     itemForm.append('skills', skillsVal);
//     itemForm.append('whatIDid', String(ref.whatIDid || 'Imported portfolio item'));
//     itemForm.append('whatILearned', String(ref.whatILearned || 'Imported portfolio item'));
//     itemForm.append('challenge', String(ref.challenge || 'None'));
//     itemForm.append('nextStep', String(ref.nextStep || 'Review item'));

//     const evList = Array.isArray(rawObj.evidence) ? rawObj.evidence : (rawObj.evidence ? [String(rawObj.evidence)] : []);
//     for (const ev of evList) {
//         if (String(ev).trim() !== '') {
//             itemForm.append('evidence[]', String(ev).trim());
//         }
//     }

//     // await postForm('api/items.php', itemForm);
//     await loadPortfolios();
// }

const importBtn = document.querySelector('#import-btn');
if (importBtn) {
    importBtn.addEventListener('click', async () => {
        const rawText = document.querySelector('#import-json-input')?.value.trim() || '';
        if (!rawText) {
            setImportMessage('Please paste JSON first.', true);
            return;
        }
        try {
            const data = JSON.parse(rawText);

            if (!data || typeof data !== 'object' || Array.isArray(data)) {
                throw new Error('JSON must be an object.');
            }

            const portfolio = portfolios.find(p => p.id === selectedId);
            if (!portfolio) {
                throw new Error('Portfolio not found.');
            }

            if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
                throw new Error('Missing or invalid "title" in JSON.');
            }

            const itemId = String(data.id || '').trim();
            if (itemId && isDuplicateItemId(selectedId, itemId)) {
                throw new Error(`Duplicate item ID "${itemId}" in the selected portfolio.`);
            }

            populateImportReview(data);
            setImportMessage('Imported JSON.', false);
        } catch (err) {
            setImportMessage(err.message, true);
        }
    });
}

const importSaveBtn = document.querySelector('#import-save-btn');
if (importSaveBtn) {
    importSaveBtn.addEventListener('click', async () => {
        if (!importedItemData) {
            setImportSaveMessage('Please import JSON first.', true);
            return;
        }

        const targetPortfolioId = document.querySelector('#import-target-portfolio')?.value || selectedId;
        if (!targetPortfolioId) {
            setImportSaveMessage('Please choose a target portfolio.', true);
            return;
        }

        const whatIDid = val('#import-what-i-did');
        const whatILearned = val('#import-what-i-learned');
        const challengeRef = val('#import-challenge');
        const nextStep = val('#import-next-step');

        if (!whatIDid || !whatILearned || !challengeRef || !nextStep) {
            setImportSaveMessage('Please fill all 4 reflection fields.', true);
            return;
        }

        const itemId = importedItemData.id || '';
        if (isDuplicateItemId(targetPortfolioId, itemId)) {
            setImportSaveMessage(`Item ID "${itemId}" already exists in this portfolio.`, true);
            return;
        }

        const formData = new FormData();    
        formData.append('portfolioId', targetPortfolioId);
        if (itemId) formData.append('id', itemId);
        formData.append('title', importedItemData.title);
        formData.append('type', importedItemData.type || 'Challenge');
        formData.append('date', importedItemData.date || new Date().toISOString().slice(0, 10));
        formData.append('role', importedItemData.role || 'Tester');
        formData.append('description', importedItemData.description || '');
        formData.append('skills', (importedItemData.skills || []).join(', '));
        formData.append('whatIDid', whatIDid);
        formData.append('whatILearned', whatILearned);
        formData.append('challenge', challengeRef);
        formData.append('nextStep', nextStep);
        // evidence = ที่มากับ JSON + ที่ผู้เล่นพิมพ์เพิ่ม (1 บรรทัดต่อ 1 รายการ)
        const evidenceList = [];
        for (const e of importedItemData.evidence) {
            evidenceList.push(e);
        }
        const lines = document.querySelector('#import-evidence-input').value.split('\n');
        for (const line of lines) {
            if (line.trim() !== '') {
                evidenceList.push(line.trim());
            }
        }
        for (const e of evidenceList) {
            formData.append('evidence[]', e);
        }

        try {
            await postForm('api/items.php', formData);
            selectedId = targetPortfolioId;
            const savedTitle = importedItemData.title;
            importedItemData = null; // กันกด Save ซ้ำโดยไม่ได้ตั้งใจ
            await loadPortfolios();
            setImportSaveMessage(`Saved "${savedTitle}" to server successfully.`, false);
           
            const reviewBox = document.querySelector('#import-review');
            setTimeout(() => {
                if (savedTitle) reviewBox.hidden = true;
            }, 2000);

        } catch (err) {
            setImportSaveMessage(err.message, true);
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