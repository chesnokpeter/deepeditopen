window.onload = start

async function start() {
    try {
        let r = await fetch('/api/user', {method: 'POST'});
        console.log(r);
        r = await r.json()
        if (r.msg === 'success') {
            console.log(r);
            // document.querySelector('.lk').innerHTML = r.name
            // document.querySelector('.name').innerHTML = r.name
            // document.querySelector('.tariff').innerHTML = "Тариф: " + r.name
            initapp(r.name, r.tariff)
            // if (r.tariff ==='beta') {
            //     document.querySelector('.t-beta-buy').innerHTML = 'Куплен'
            // }
        } else if (r.msg === 'Signature has expired') {
            refresh()
        }
    } catch (error) {
        window.location.href = "/login";
    }
    


}

async function refresh() {
    try {
        r = await fetch('/api/refresh', {method: 'POST', redirect: 'follow'})
        r = await r.json()
        if (r.msg === 'success') {
            start()
        } else {
            window.location.href = "/login";
        }
    } catch (error) {
        window.location.href = "/login";
    }
    
}





function initapp(name, tariff) {
    document.body.style.justifyContent = 'start'

    document.getElementById('lds-ring').remove()
    // Создаем div с классом "panel" и id "panel"
    var panelDiv = document.createElement('div');
    panelDiv.className = 'panel';
    panelDiv.id = 'panel';

    // Создаем div с классом "tariff" и текстом "Тариф:"
    var tariffDiv = document.createElement('div');
    tariffDiv.className = 'tariff';
    tariffDiv.appendChild(document.createTextNode(`Тариф: ${tariff}`));

    // Создаем img элемент
    var imgElement = document.createElement('img');
    imgElement.src = "/logow.svg";
    imgElement.alt = '';

    // Создаем ссылку
    // var linkElement = document.createElement('a');
    // linkElement.href = "/lk";
    var lkDiv = document.createElement('div');
    lkDiv.className = 'lk';
    lkDiv.appendChild(document.createTextNode(name));
    

    // Добавляем созданные элементы внутрь div с id "panel"
    panelDiv.appendChild(tariffDiv);
    panelDiv.appendChild(imgElement);
    panelDiv.appendChild(lkDiv);

    // Добавляем div с классом "panel" в HTML-документ
    document.body.appendChild(panelDiv);


    var accountDiv = document.createElement('div');
    accountDiv.className = 'text';
    accountDiv.textContent = `Личный аккаунт ${name}`;
    
    var nameDiv = document.createElement('div');
    nameDiv.className = 'name';
    nameDiv.id = 'name';
    nameDiv.textContent = '';

    accountDiv.appendChild(nameDiv);

    document.body.appendChild(accountDiv);

    // Создаем элемент для тарифов
    var tariffsDiv = document.createElement('div');
    tariffsDiv.className = 'text';
    tariffsDiv.textContent = 'Тарифы:';

    document.body.appendChild(tariffsDiv);

    // Создаем элемент для блока с тарифами
    var tariffsContainerDiv = document.createElement('div');
    tariffsContainerDiv.className = 'tariffs';

    // Создаем блоки для тарифов
    var t1Div = document.createElement('div');
    t1Div.className = 't1';

    var t1TextDiv1 = document.createElement('div');
    t1TextDiv1.className = 't-text';
    t1TextDiv1.textContent = 'Бесплатный';
    t1Div.appendChild(t1TextDiv1);

    var t1TextDiv2 = document.createElement('div');
    t1TextDiv2.className = 't-text';
    t1TextDiv2.textContent = 'Автоматически всем аккаунтам';
    t1Div.appendChild(t1TextDiv2);

    var t1TextDiv3 = document.createElement('div');
    t1TextDiv3.className = 't-text';
    t1TextDiv3.textContent = '1 картинка';
    t1Div.appendChild(t1TextDiv3);

    var t1FreeBuyDiv = document.createElement('div');
    t1FreeBuyDiv.className = 't-free-buy';
    if (tariff ==='beta') {
        t1FreeBuyDiv.textContent = 'Куплен';
    } else {
        t1FreeBuyDiv.textContent = 'Куплен';
    }

    
    t1Div.appendChild(t1FreeBuyDiv);

    tariffsContainerDiv.appendChild(t1Div);

    var t2Div = document.createElement('div');
    t2Div.className = 't2';

    var t2TextDiv1 = document.createElement('div');
    t2TextDiv1.className = 't-text';
    t2TextDiv1.textContent = 'БЕТА';
    t2Div.appendChild(t2TextDiv1);

    var t2TextDiv2 = document.createElement('div');
    t2TextDiv2.className = 't-text';
    t2TextDiv2.textContent = '200р/месяц';
    t2Div.appendChild(t2TextDiv2);

    var t2TextDiv3 = document.createElement('div');
    t2TextDiv3.className = 't-text';
    t2TextDiv3.textContent = '∞ картинок';
    t2Div.appendChild(t2TextDiv3);

    var t2BetaBuyDiv = document.createElement('div');
    t2BetaBuyDiv.className = 't-beta-buy';
    if (tariff ==='beta') {
        t2BetaBuyDiv.textContent = 'Куплен';
    } else {
        t2BetaBuyDiv.textContent = 'Купить';
    }
    t2Div.appendChild(t2BetaBuyDiv);

    tariffsContainerDiv.appendChild(t2Div);

    document.body.appendChild(tariffsContainerDiv);

    // Создаем элемент для кнопки выхода из аккаунта
    var logoutDiv = document.createElement('div');
    logoutDiv.className = 'logout';
    logoutDiv.textContent = 'Выйти из аккаунта';

    document.body.appendChild(logoutDiv);


    document.querySelector('.logout').onclick = exit


}


    async function exit() {
        r = await fetch('/api/logout', {method: 'POST', redirect: 'follow'})
        window.location.href = "/login";
    }





{/* <div class="panel" id="panel">
        <div class="tariff">Тариф:</div>
        <img src="{{ url_for('static', path='wide.svg') }}" alt=""> 
        <div class="lk"></div>
    </div>

    <div class="text">Личный аккаунт <div class="name" id="name"></div></div>
    <div class="text">Тарифы:</div>
    <div class="tariffs">
        <div class="t1">
            <div class="t-text">Бесплатный</div>
            <div class="t-text">Автоматически всем аккаунтам</div>
            <div class="t-text">1 картинка</div>
            <div class="t-free-buy">Куплен</div>
        </div>
        <div class="t2">
            <div class="t-text">БЕТА</div>
            <div class="t-text">200р/месяц</div>
            <div class="t-text">∞ картинок</div>
            <div class="t-beta-buy">Купить</div>
        </div>
    </div>

    <div class="logout">Выйти из аккаунта</div> */}