window.onload = start

async function start() {
    try {
        let r = await fetch('/api/user', {method: 'POST'});
        console.log(r);
        r = await r.json()
        if (r.msg === 'success') {
            initapp(r.name, r.tariff)
            console.log(r);
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
    var linkElement = document.createElement('a');
    linkElement.href = "/lk";
    var lkDiv = document.createElement('div');
    lkDiv.className = 'lk';
    lkDiv.appendChild(document.createTextNode(name));
    linkElement.appendChild(lkDiv);

    // Добавляем созданные элементы внутрь div с id "panel"
    panelDiv.appendChild(tariffDiv);
    panelDiv.appendChild(imgElement);
    panelDiv.appendChild(linkElement);

    // Добавляем div с классом "panel" в HTML-документ
    document.body.appendChild(panelDiv);

    // Повторяем процесс для остальных элементов, например:
    var eDiv = document.createElement('div');
    eDiv.className = 'e';
    eDiv.id = 'e';
    eDiv.appendChild(document.createTextNode('Внимание, это БЕТА-версия, могут наблюдаться проблемы!'));
    document.body.appendChild(eDiv);

    var root = document.createElement('div');
    root.className = 'root'
    root.id = 'root'
    document.body.appendChild(root)

        // Находим родительский элемент, куда будем добавлять все остальные элементы

    // Создаем элементы
    var materialDiv = document.createElement('div');
    materialDiv.className = 't';
    materialDiv.textContent = 'Материал:';
    materialDiv.id = 'material';

    var labelMaterial = document.createElement('label');
    labelMaterial.htmlFor = 'target';
    labelMaterial.className = 'label';
    labelMaterial.id = 'targetl';
    labelMaterial.textContent = 'Загрузить видео или фото';

    var inputTarget = document.createElement('input');
    inputTarget.type = 'file';
    inputTarget.className = 'target';
    inputTarget.name = 'target';
    inputTarget.id = 'target';
    inputTarget.accept = 'image/jpg, image/jpeg, image/png';

    var videoPlayerDiv = document.createElement('div');
    videoPlayerDiv.id = 'videoplayer';

    var faceDiv = document.createElement('div');
    faceDiv.className = 't';
    faceDiv.textContent = 'Лицо:';

    var labelFace = document.createElement('label');
    labelFace.htmlFor = 'face';
    labelFace.className = 'label';
    labelFace.id = 'facel';
    labelFace.textContent = 'Загрузить фото';

    var inputFace = document.createElement('input');
    inputFace.type = 'file';
    inputFace.className = 'face';
    inputFace.name = 'face';
    inputFace.id = 'face';
    inputFace.accept = 'image/png, image/jpeg, image/jpg';

    var photoPlayerDiv = document.createElement('div');
    photoPlayerDiv.id = 'photoplayer';

    var createdByDiv = document.createElement('div');
    createdByDiv.className = 'by';
    createdByDiv.textContent = 'by2023@deepedit';

    var dialogDiv = document.createElement('dialog');
    dialogDiv.id = 'dialog';
    dialogDiv.textContent = 'Так как это открытый бета-тест, то мы пока не можем обрабатывать видео дольше 30 минут(';

    // Добавляем созданные элементы в родительский элемент
    root.appendChild(materialDiv);
    root.appendChild(labelMaterial);
    root.appendChild(inputTarget);
    root.appendChild(videoPlayerDiv);
    root.appendChild(faceDiv);
    root.appendChild(labelFace);
    root.appendChild(inputFace);
    root.appendChild(photoPlayerDiv);
    root.appendChild(createdByDiv);
    root.appendChild(dialogDiv);

    files()
}





function files() {
    let filetarget = document.getElementById('target');
    let videoPlayer = document.getElementById('videoplayer');
    let fileface = document.getElementById('face');
    let photoPlayer = document.getElementById('photoplayer');

    var videotruetrue = []
    var phototruetrue = []

    filetarget.addEventListener('change', (event) => {
        let selectedFile = event.target.files[0];
        videotruetrue.push(selectedFile)
        photo = document.createElement('img');
        photo.id = 'video'
        photo.src = URL.createObjectURL(selectedFile);
        videoPlayer.innerHTML = '';
        videoPlayer.appendChild(photo);
        document.getElementById("target").remove();
        document.getElementById("targetl").remove();
        if (document.getElementById('photo')){
            btnDeep(phototruetrue, videotruetrue)
        }
    });
    
    
    fileface.addEventListener('change', (event) => {
        let selectedFile = event.target.files[0];
        phototruetrue.push(selectedFile)
        photo = document.createElement('img');
        photo.id = 'photo'
        photo.src = URL.createObjectURL(selectedFile);
        photoPlayer.innerHTML = '';
        photoPlayer.appendChild(photo);
        document.getElementById("face").remove();
        document.getElementById("facel").remove();
        if (document.getElementById('video')){
            btnDeep(phototruetrue, videotruetrue)
        }
    });
}









// filetarget.addEventListener('change', (event) => {
//     let selectedFile = event.target.files[0];
//     try {
//         let video = document.createElement('video');
//         videotruetrue.push(selectedFile)
//         video.src = URL.createObjectURL(selectedFile);
//         video.controls = true;
//         video.addEventListener('loadedmetadata', function() {
//             if (video.duration > 18) {
//                 window.dialog.showModal()
//             } else {
//                 videoPlayer.innerHTML = '';
//                 videoPlayer.appendChild(video);
//                 video.id = 'video'
//                 document.getElementById("target").remove();
//                 document.getElementById("targetl").remove();
//                 if (document.getElementById('photo')){
//                     btnDeep()
//                 }
//             }
//         })
//     } catch (error) {
//         console.log(error);

//         videotruetrue.push(selectedFile)
//         photo = document.createElement('video');
//         photo.id = 'video'
//         photo.src = URL.createObjectURL(selectedFile);
//         videoPlayer.innerHTML = '';
//         videoPlayer.appendChild(photo);
//         document.getElementById("target").remove();
//         document.getElementById("targetl").remove();
//         if (document.getElementById('photo')){
//             btnDeep()
//         }
//     }
// })



function btnDeep(phototruetrue, videotruetrue) {
    let materialtext = document.getElementById('material')
    let parentDiv = materialtext.parentNode;
    let deepfakebtn = document.createElement("input"); deepfakebtn.type = 'button'; deepfakebtn.name = 'submit';
    let deepfakelabel = document.createElement("label"); deepfakelabel.for = 'submit'; deepfakelabel.innerHTML = 'ДИПФЕЙКНУТЬ!';
    parentDiv.insertBefore(deepfakebtn, materialtext);
    parentDiv.insertBefore(deepfakelabel, deepfakebtn);
    deepfakelabel.onclick = sendDeep(phototruetrue, videotruetrue)
}

async function sendDeep(phototruetrue, videotruetrue) {
    console.log(phototruetrue);
    console.log(videotruetrue);
    // start()

    let Data = new FormData();
    Data.append('target', videotruetrue[0]);
    Data.append('source', phototruetrue[0]);
    Data.append('sfiletype', phototruetrue[0].name.split('.').at(-1))
    Data.append('tfiletype', videotruetrue[0].name.split('.').at(-1))

    let options = {
        method: 'POST',
        body: Data
    };

    let r = await fetch('/api/create', options);
    r = await r.json()
    if (r.message === 'query added') {
        PREWaitingDeep(r.task, false, NaN, 'Генерация дипфейка...')
    } else if (r.message === 'another task has already been started') {
        PREWaitingDeep(r.task, true, Data, 'Дипфейк в очереди...')
    } else {
        window.dialog.innerHTML = `Ошибка:${r}
        Напишите https://t.me/chesnokpeter
        Обновите страницу`
        window.dialog.showModal()
        console.log(r);
    }
}

async function PREWaitingDeep(task, another, Data, text) {
    document.getElementById('root').remove();
    document.getElementById('panel').remove();
    document.getElementById('e').remove();

    let a = document.createElement('div')
    a.className = 'waiting'
    a.id = 'waiting'
    document.getElementById('body').appendChild(a)
    
    a = document.createElement('div')
    a.className = 'gen'
    a.innerHTML = text
    document.getElementById('waiting').appendChild(a)
    a = document.createElement('div')
    a.className = 'row'
    a.id = 'row'
    document.getElementById('waiting').appendChild(a)
    a = document.createElement('div')
    a.className = 'col-sm-2'
    a.id = 'col-sm-2'
    document.getElementById('row').appendChild(a)
    a = document.createElement('div')
    a.className = 'col-xs-4'
    a.id = 'col-xs-4'
    document.getElementById('col-sm-2').appendChild(a)
    a = document.createElement('div')
    a.className = 'text-center'
    a.id = 'text-center'
    document.getElementById('col-xs-4').appendChild(a)
    a = document.createElement('div')
    a.className = 'pong-loader'
    a.id = 'pong-loader'
    document.getElementById('text-center').appendChild(a)

    if (another === true) {
        AnotherTask(Data)
    }
    else if (another === false) {
        waitingDeep(task)
    }
}

function AnotherTask(Data) {
    let shouldStop = false;

    async function repeat() {
        let options = {
            method: 'POST',
            body: Data
        };
    
        let r = await fetch('/api/create', options);
        r = await r.json()
        console.log(r);
        if (r.message === 'query added') {
            shouldStop = true
        }

        if (shouldStop) {
            clearInterval(intervalId)
            waitingDeep(r.task)
        }
    }

    const intervalId = setInterval(repeat, 3000);
}


async function waitingDeep(task) {
    let a = document.getElementsByClassName('gen')
    a.innerHTML = 'Генерация дипфейка...'
    var task = task
    let shouldStop = false;

    async function repeat() {
        let r = await fetch(`/api/complite?task=${task}`);
        r = await r.json()
        console.log(r);
        if (r.message === 'completed') {
            shouldStop = true
        }

        if (shouldStop) {
            clearInterval(intervalId);
            getDeep(task)
        }
    }

    const intervalId = setInterval(repeat, 3000);
}



async function getDeep(task) {
    let r = await fetch(`/api/get?task=${task}`);
    r = await r.blob();

    document.getElementById('waiting').remove();
    let a = document.createElement('div')
    a.className = 'panell'
    a.id = 'panel'
    document.getElementById('body').appendChild(a)
    a = document.createElement('img')
    a.src = '../static/iconw.svg'
    document.getElementById('panel').appendChild(a)
    a = document.createElement('img')
    a.src = URL.createObjectURL(r)
    // a.controls = true;
    document.getElementById('body').appendChild(a)
}

