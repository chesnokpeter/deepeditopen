document.querySelector('.submit').onclick = login


async function login() {
    const email = document.querySelector('.email').value
    const password = document.querySelector('.password').value
    const name = document.querySelector('.name').value

    if (email && password && name) {

        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        const Body = JSON.stringify({
            "login": email,
            "password":password,
            "name":name
        });
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: Body,
            redirect: 'follow'
        };

        spinner()
        let response = await fetch("/api/signup", requestOptions);
        response = await response.json()
        console.log(response);
        if (response.msg !== 'success') {
            despinner()
            document.querySelector('.error').innerHTML = response.ru
        } else {
            window.location.href = "/confirmPage";
        }

    }

}

document.getElementById('password').addEventListener('input', function() {
    let password = document.getElementById('password').value;

    if (password.length >= 8 && /\d+/.test(password) && /[a-z]/.test(password) ) {
        document.getElementById('pswrd').innerHTML = 'Пароль надёжный'
    } else {
        document.getElementById('pswrd').innerHTML = `Требования для пароля: <br>
        Пароль должен состоять из цифр и латинских букв, а также его длина должна быть больше 8 символовs`
        var keyframes = [
            { transform: 'translate(0, 0)' },
            { transform: 'translate(5px, 5px)' },
            { transform: 'translate(-5px, -5px)' },
            { transform: 'translate(5px, -5px)' },
            { transform: 'translate(-5px, 5px)' }
        ];
        
        var options = {
            duration: 20, 
            iterations: 1, 
            easing: 'ease-in-out',
        };
        document.getElementById('pswrd').animate(keyframes, options);
    }
});


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
    a.value = 'Зарегистрироваться'
    
    document.getElementById('spinner').parentNode.insertBefore(a, document.getElementById('spinner'))

    document.getElementById('spinner').remove()


    document.querySelector('.submit').onclick = login
}