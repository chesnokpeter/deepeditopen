window.onload = start

async function start() {
    try {
        let r = await fetch('/api/user', {method: 'POST'});
        console.log(r);
        r = await r.json()
        if (r.msg === 'success') {
            console.log(r);
            document.querySelector('.lk').innerHTML = r.name
            document.querySelector('.tariff').innerHTML = "Тариф: " + r.tariff
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
            console.log(111);
            window.location.href = "/login";
        }
    } catch (error) {
        window.location.href = "/login";
    }
    
}