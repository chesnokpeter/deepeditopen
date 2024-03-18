document.querySelector('.submit').onclick = login

async function login() {
    const email = document.querySelector('.email').value
    const password = document.querySelector('.password').value

    if (email && password) {

        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        const Body = JSON.stringify({
            "login": email,
            "password":password
        });

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: Body,
            redirect: 'follow'
        };

        spinner()

        let response = await fetch("/api/login", requestOptions);
        response = await response.json()
        console.log(response);
        if (response.msg !== 'success') {
            despinner()
            document.querySelector('.error').innerHTML = response.ru
        } else {
            window.location.href = "/home";
        }

    }


}



function spinner() {
    let a = document.createElement('div')
    a.className = 'spinner'
    a.id = 'spinner'
    a.style = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 185px;
    height: 30px;`
    document.getElementById('btn').parentNode.insertBefore(a, document.getElementById('btn'))
    document.getElementById('btn').remove()

    a = document.createElement('div')
    a.className = 'lds-ring'
    a.id = 'lds-ring'
    document.getElementById('spinner').appendChild(a)

    a = document.createElement('div')
    document.getElementById('lds-ring').appendChild(a)
    
    a = document.createElement('div')
    document.getElementById('lds-ring').appendChild(a)

    a = document.createElement('div')
    document.getElementById('lds-ring').appendChild(a)

    a = document.createElement('div')
    document.getElementById('lds-ring').appendChild(a)
}


function despinner() {
    let a = document.createElement('input')
    a.className = 'submit'
    a.id = 'btn'
    a.type = 'button'
    a.value = 'Готово'
    
    document.getElementById('spinner').parentNode.insertBefore(a, document.getElementById('spinner'))

    document.getElementById('spinner').remove()


    document.querySelector('.submit').onclick = login
}