const form = document.querySelector('form');
const loading = document.querySelector('.loading');
const meowsElement = document.querySelector('.meows');
const API_URL = 'http://localhost:5000/meows';

loading.style.display = '';

listAllMeows();

form.addEventListener('submit', function name(event) {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');
    const meow = {
        name,
        content,
    };
    loading.style.display = '';
    form.style.display =  'none';
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(meow),
        headers: {
            'content-type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(created => {
            console.log(created);
            form.reset();
            loading.style.display = 'none';
            form.style.display =  '';
            listAllMeows();
        });
});

function listAllMeows() {
    meowsElement.innerHTML = '';
    fetch(API_URL)
        .then(response => response.json())
        .then(meows => {
            meows.reverse();
            meows.forEach(meow => {
                const div = document.createElement('div');
                const header = document.createElement('h3');
                const date = document.createElement('p');
                const content = document.createElement('h5');

                header.textContent = meow.name;
                date.textContent = new Date(meow.created); 
                content.textContent = meow.content;

                div.appendChild(header);
                div.appendChild(date);
                div.appendChild(content);
                meowsElement.appendChild(div);
            });
            loading.style.display = 'none';
        });
}