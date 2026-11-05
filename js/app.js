// พอร์ต 1 
const form1 = document.querySelector('#profile-form-1');
const STORAGE_KEY_1 = 'powerup-portfolio-1';

function showPortfolio1(portfolio) {
    document.querySelector('#portfolio-name-1').textContent = portfolio.displayName;
    document.querySelector('#portfolio-enjoy-1').textContent = portfolio.whatIEnjoy;
    document.querySelector('#portfolio-tried-1').textContent = portfolio.whatIveTried;
    document.querySelector('#portfolio-curious-1').textContent = portfolio.whatImCuriousAbout;
}

form1.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.querySelector('#displayName-1').value.trim();
    const error = document.querySelector('#profile-error-1');
    if (name === '') {
        error.textContent = 'Please enter your name.';
        return;
    }
    error.textContent = '';
    const portfolio = {
        displayName: name,
        whatIEnjoy: document.querySelector('#enjoy-1').value.trim(),
        whatIveTried: document.querySelector('#tried-1').value.trim(),
        whatImCuriousAbout: document.querySelector('#curious-1').value.trim()
    };
    showPortfolio1(portfolio);

    const savedData = localStorage.getItem(STORAGE_KEY_1);
    let portfolioData = savedData ? JSON.parse(savedData) : {};
    portfolioData.profile = portfolio;
    localStorage.setItem(STORAGE_KEY_1, JSON.stringify(portfolioData));
});

const formItem1 = document.querySelector('#profile-form-item-1');

formItem1.addEventListener("submit", function (event) {
    event.preventDefault();
    const title1 = document.querySelector("#Title-1").value;
    const role1 = document.querySelector("#Role-1").value;
    const skill1 = document.querySelector("#Skill-1").value;
    const reflection1 = document.querySelector("#Reflection-1").value;
    const evidence1 = document.querySelector("#Evidence-1").value;
    const title2 = document.querySelector("#Title2-1").value;
    const role2 = document.querySelector("#Role2-1").value;
    const skill2 = document.querySelector("#Skill2-1").value;
    const reflection2 = document.querySelector("#Reflection2-1").value;
    const evidence2 = document.querySelector("#Evidence2-1").value;
    
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
    
    document.querySelector("#portfolio-Title-1").textContent = title1;
    document.querySelector("#portfolio-Role-1").textContent = role1;
    document.querySelector("#portfolio-Skills-1").textContent = skill1;
    document.querySelector("#portfolio-Reflection-1").textContent = reflection1;
    document.querySelector("#portfolio-Evidence-1").textContent = evidence1;
    document.querySelector("#portfolio-Title2-1").textContent = title2;
    document.querySelector("#portfolio-Role2-1").textContent = role2;
    document.querySelector("#portfolio-Skills2-1").textContent = skill2;
    document.querySelector("#portfolio-Reflection2-1").textContent = reflection2;
    document.querySelector("#portfolio-Evidence2-1").textContent = evidence2;

    const savedData = localStorage.getItem(STORAGE_KEY_1);
    let portfolioData = savedData ? JSON.parse(savedData) : {};

    portfolioData.items = [
        { title: title1, role: role1, skill: skill1, reflection: reflection1, evidence: evidence1 },
        { title: title2, role: role2, skill: skill2, reflection: reflection2, evidence: evidence2 }
    ];

    localStorage.setItem(STORAGE_KEY_1, JSON.stringify(portfolioData));
});

const savedData1 = localStorage.getItem(STORAGE_KEY_1);
if (savedData1 !== null) {
    try {
        const savedPortfolio = JSON.parse(savedData1);
        if (savedPortfolio.profile) showPortfolio1(savedPortfolio.profile);

        if (savedPortfolio.items && savedPortfolio.items.length > 0) {
            const items = savedPortfolio.items;
            document.querySelector("#portfolio-Title-1").textContent = items[0].title || '';
            document.querySelector("#portfolio-Role-1").textContent = items[0].role || '';
            document.querySelector("#portfolio-Skills-1").textContent = items[0].skill || '';
            document.querySelector("#portfolio-Reflection-1").textContent = items[0].reflection || '';
            document.querySelector("#portfolio-Evidence-1").textContent = items[0].evidence || '';

            document.querySelector("#portfolio-Title2-1").textContent = items[1].title || '';
            document.querySelector("#portfolio-Role2-1").textContent = items[1].role || '';
            document.querySelector("#portfolio-Skills2-1").textContent = items[1].skill || '';
            document.querySelector("#portfolio-Reflection2-1").textContent = items[1].reflection || '';
            document.querySelector("#portfolio-Evidence2-1").textContent = items[1].evidence || '';
        }
    } catch (error) {
        console.error('Could not restore Portfolio 1:', error);
    }
}


// พอร์ต 2 
const form2 = document.querySelector('#profile-form-2');
const STORAGE_KEY_2 = 'powerup-portfolio-2';

function showPortfolio2(portfolio) {
    document.querySelector('#portfolio-name-2').textContent = portfolio.displayName || 'Your name';
    document.querySelector('#portfolio-enjoy-2').textContent = portfolio.whatIEnjoy || 'none';
    document.querySelector('#portfolio-tried-2').textContent = portfolio.whatIveTried || 'none';
    document.querySelector('#portfolio-curious-2').textContent = portfolio.whatImCuriousAbout || 'none';
}

form2.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.querySelector('#displayName-2').value.trim();
    const error = document.querySelector('#profile-error-2');
    if (name === '') {
        error.textContent = 'Please enter your name.';
        return;
    }
    error.textContent = '';
    const portfolio = {
        displayName: name,
        whatIEnjoy: document.querySelector('#enjoy-2').value.trim(),
        whatIveTried: document.querySelector('#tried-2').value.trim(),
        whatImCuriousAbout: document.querySelector('#curious-2').value.trim()
    };
    showPortfolio2(portfolio);

    const savedData = localStorage.getItem(STORAGE_KEY_2);
    let portfolioData = savedData ? JSON.parse(savedData) : {};
    portfolioData.profile = portfolio;
    localStorage.setItem(STORAGE_KEY_2, JSON.stringify(portfolioData));
});

const formItem2 = document.querySelector('#profile-form-item-2');
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

const savedData2 = localStorage.getItem(STORAGE_KEY_2);
if (savedData2 !== null) {
    try {
        const savedPortfolio = JSON.parse(savedData2);
        if (savedPortfolio.profile) showPortfolio2(savedPortfolio.profile);

        if (savedPortfolio.items && savedPortfolio.items.length > 0) {
            const items = savedPortfolio.items;
            document.querySelector("#portfolio-Title-2").textContent = items[0].title || '';
            document.querySelector("#portfolio-Role-2").textContent = items[0].role || '';
            document.querySelector("#portfolio-Skills-2").textContent = items[0].skill || '';
            document.querySelector("#portfolio-Reflection-2").textContent = items[0].reflection || '';
            document.querySelector("#portfolio-Evidence-2").textContent = items[0].evidence || '';

            document.querySelector("#portfolio-Title2-2").textContent = items[1].title || '';
            document.querySelector("#portfolio-Role2-2").textContent = items[1].role || '';
            document.querySelector("#portfolio-Skills2-2").textContent = items[1].skill || '';
            document.querySelector("#portfolio-Reflection2-2").textContent = items[1].reflection || '';
            document.querySelector("#portfolio-Evidence2-2").textContent = items[1].evidence || '';
        }
    } catch (error) {
        console.error('Could not restore Portfolio 2:', error);
    }
}