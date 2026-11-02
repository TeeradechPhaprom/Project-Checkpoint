const form = document.querySelector('#profile-form');
const STORAGE_KEY = 'powerup-portfolio';

function showPortfolio(portfolio) {
    document.querySelector('#portfolio-name').textContent = portfolio.displayName;
    document.querySelector('#portfolio-enjoy').textContent = portfolio.whatIEnjoy;
    document.querySelector('#portfolio-tried').textContent = portfolio.whatIveTried;
    document.querySelector('#portfolio-curious').textContent = portfolio.whatImCuriousAbout;
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.querySelector('#displayName').value.trim();
    const error = document.querySelector('#profile-error');
    if (name === '') {
        error.textContent = 'Please enter your name.';
        return;
    }
    error.textContent = '';
    const portfolio = {
        displayName: name,
        whatIEnjoy: document.querySelector('#enjoy').value.trim(),
        whatIveTried: document.querySelector('#tried').value.trim(),
        whatImCuriousAbout: document.querySelector('#curious').value.trim()
    };
    showPortfolio(portfolio);

    const json = JSON.stringify(portfolio);
    localStorage.setItem(STORAGE_KEY, json);
});

const form2 = document.querySelector('#profile-form-item');

form2.addEventListener("submit", function (event) {
    event.preventDefault();
    const title1 = document.querySelector("#Title").value;
    const role1 = document.querySelector("#Role").value;
    const skill1 = document.querySelector("#Skill").value;
    const reflection1 = document.querySelector("#Reflection").value;
    const evidence1 = document.querySelector("#Evidence").value;
    const title2 = document.querySelector("#Title2").value;
    const role2 = document.querySelector("#Role2").value;
    const skill2 = document.querySelector("#Skill2").value;
    const reflection2 = document.querySelector("#Reflection2").value;
    const evidence2 = document.querySelector("#Evidence2").value;
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
    
    document.querySelector("#portfolio-Title").textContent = title1;
    document.querySelector("#portfolio-Role").textContent = role1;
    document.querySelector("#portfolio-Skills").textContent = skill1;
    document.querySelector("#portfolio-Reflection").textContent = reflection1;
    document.querySelector("#portfolio-Evidence").textContent = evidence1;
    document.querySelector("#portfolio-Title2").textContent = title2;
    document.querySelector("#portfolio-Role2").textContent = role2;
    document.querySelector("#portfolio-Skills2").textContent = skill2;
    document.querySelector("#portfolio-Reflection2").textContent = reflection2;
    document.querySelector("#portfolio-Evidence2").textContent = evidence2;
}
)

const savedData = localStorage.getItem(STORAGE_KEY);
if (savedData !== null) {
    try {
        const savedPortfolio = JSON.parse(savedData);
        showPortfolio(savedPortfolio);
    } catch (error) {
        console.error('Could not restore the saved Portfolio:', error);
    }
}