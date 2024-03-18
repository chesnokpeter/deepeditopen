let filetarget = document.getElementById('target');
let videoPlayer = document.getElementById('videoplayer');
let fileface = document.getElementById('face');
let photoPlayer = document.getElementById('photoplayer');

var videotruetrue = []
var phototruetrue = []


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
        btnDeep()
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
        btnDeep()
    }
});

function btnDeep() {
    let materialtext = document.getElementById('material')
    let parentDiv = materialtext.parentNode;
    let deepfakebtn = document.createElement("input"); deepfakebtn.type = 'button'; deepfakebtn.name = 'submit';
    let deepfakelabel = document.createElement("label"); deepfakelabel.for = 'submit'; deepfakelabel.innerHTML = 'ДИПФЕЙКНУТЬ!';
    parentDiv.insertBefore(deepfakebtn, materialtext);
    parentDiv.insertBefore(deepfakelabel, deepfakebtn);
    deepfakelabel.onclick = sendDeep
}

async function sendDeep() {
    console.log(phototruetrue);
    console.log(videotruetrue);
    start()

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

