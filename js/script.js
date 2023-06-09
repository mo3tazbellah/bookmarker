let siteNameInp, siteUrlInp, addBtn, deleteBtn, deleteBoxInput, deleteBoxBtn, closeDeleteBox, siteUrlLabel, siteNameLabel, anchorContent, anchors, websites;
siteNameInp = document.getElementById('site-name');
siteUrlInp = document.getElementById('site-url');
addBtn = document.getElementById('add-btn');
deleteBtn = document.getElementById('delete-btn');
deleteBoxInput = document.getElementById('delete-box-input');
deleteBoxBtn = document.getElementById('confirm-btn');
closeDeleteBox = document.getElementById('close-delete-box')
siteUrlLabel = document.getElementById('site-url-label')
siteNameLabel = document.getElementById('site-name-label')
anchorContent = document.getElementsByClassName('anchor-content')
anchors = document.getElementsByTagName('a');
anchorIcon = document.getElementsByClassName('anchor-icon')

if (localStorage.getItem('websites') != null) {
    websites = JSON.parse(localStorage.getItem('websites'))
    display();
} else {
    websites = [];
}

function webCounter() {
    webNumber = document.getElementById('web-number')
    let counter = 0;
    let speed;
    (websites.length > 10) ? speed = 90 : speed = 150;
    if (websites.length > 0) {
        let x = setInterval(() => {
            counter++
            webNumber.innerHTML = counter
            if (counter == websites.length) { clearInterval(x) }
        }, speed)
    } else {
        webNumber.innerHTML = counter
    }
}
webCounter();

function noteDisplay() {
    let note = document.getElementById('note')
    note.style.display = `block`
    setTimeout(() => { note.style.transform = `translateY(0)` }, 10)

    const p = document.querySelector('#note p')
    const txt = `Links saved here are only stored locally on your browser. Use the same browser/device to access and keep your data.`;
    let i = 0;
    p.innerHTML = ``
    let x = setInterval(() => {
        p.innerHTML += txt.charAt(i)
        i++
        if (i == txt.length) {
            clearInterval(x)
            close();
        }
    }, 75)

    function close() {
        setTimeout(() => { note.style.transform = `translateY(125%)` }, 6000)
        setTimeout(() => { note.style.display = `none` }, 7000)
    }
}

window.addEventListener('scroll', function () {
    let bookmarker = document.querySelector('.bookMarker')
    pixels = this.scrollY * -0.5
    bookmarker.style.transform = `translateY(${pixels}px)`
});

siteNameInp.addEventListener('keyup', function () {
    blockedCursorClass();
    if (!nameValidation() && !siteNameLabel.innerHTML.includes('</i>')) {
        siteNameLabel.innerHTML += '<i class="fas fa-exclamation mx-2 text-danger"></i>'
        siteNameInp.classList.add('invalid-input')
    } else if (nameValidation()) {
        siteNameLabel.innerHTML = siteNameLabel.innerHTML.replace('<i class="fas fa-exclamation mx-2 text-danger"></i>', '')
        siteNameInp.classList.remove('invalid-input')
    }

})

siteUrlInp.addEventListener('keyup', function () {
    blockedCursorClass();
    if (!urlValidation() && !siteUrlLabel.innerHTML.includes('</i>')) {
        siteUrlLabel.innerHTML += '<i class="fas fa-exclamation mx-2 text-danger"></i>'
        siteUrlInp.classList.add('invalid-input')
    } else if (urlValidation()) {
        siteUrlLabel.innerHTML = siteUrlLabel.innerHTML.replace('<i class="fas fa-exclamation mx-2 text-danger"></i>', '')
        siteUrlInp.classList.remove('invalid-input')
    }

})

addBtn.addEventListener('click', function () {
    blockedCursorClass();
    if (urlValidation() && nameValidation()) {
        if (siteNameLabel.innerHTML.includes('</i>') || siteUrlLabel.innerHTML.includes('</i>')) {
            siteNameLabel.innerHTML = siteNameLabel.innerHTML.replace('<i class="fas fa-exclamation mx-2 text-danger"></i>', '')
            siteUrlLabel.innerHTML = siteUrlLabel.innerHTML.replace('<i class="fas fa-exclamation mx-2 text-danger"></i>', '')
        }
        if (websites.length == 0) { noteDisplay(); }
        pushWebsite();
        display();
        clearInputs();
        webCounter();
    } else {
        if (!nameValidation() && !siteNameLabel.innerHTML.includes('</i>')) {
            siteNameLabel.innerHTML += '<i class="fas fa-exclamation mx-2 text-danger"></i>'
            siteNameInp.classList.add('invalid-input')
        }

        if (!urlValidation() && !siteUrlLabel.innerHTML.includes('</i>')) {
            siteUrlLabel.innerHTML += '<i class="fas fa-exclamation mx-2 text-danger"></i>'
            siteUrlInp.classList.add('invalid-input')
        }
    }
})

deleteBoxInput.addEventListener('keyup', function () {

    let deleteError = document.getElementById('delete-box-error')

    if (this.value == '0') {
        deleteBoxBtn.innerHTML = 'delete all'
    } else {
        deleteBoxBtn.innerHTML = 'delete'
    }

    if (this.value >= 0 && this.value <= websites.length) {
        deleteError.innerHTML = ''
    } else {
        deleteError.innerHTML = 'please enter an existent index number'
    }


})

deleteBoxBtn.addEventListener('click', function () {
    let deleteError = document.getElementById('delete-box-error')

    if (deleteBoxInput.value == '0') {
        websites = [];
        localStorage.setItem('websites', JSON.stringify(websites));
        hideDeleteOverlay();
        display();
        webCounter();
    } else if (deleteBoxInput.value > 0 && deleteBoxInput.value <= websites.length) {
        websites.splice(deleteBoxInput.value - 1, 1);
        localStorage.setItem('websites', JSON.stringify(websites));
        hideDeleteOverlay();
        display();
        webCounter();
    } else {
        deleteError.innerHTML = 'please enter an existent index number'
        let deleteBox = document.getElementById('delete-box')
        deleteBox.classList.add('error-animation')
        setTimeout(() => { deleteBox.classList.remove('error-animation') }, 400)
    }

})

deleteBtn.addEventListener('click', function () {
    showDeleteOverlay()
});

closeDeleteBox.addEventListener('click', function () { hideDeleteOverlay() })

function checkInputs() {
    if (siteNameInp.value != '' && siteUrlInp.value != '') {
        return true;
    } else {
        return false;
    }
}

function pushWebsite() {
    let website = {
        name: siteNameInp.value,
        url: checkUrl().toLowerCase()
    }
    websites.push(website)
    localStorage.setItem('websites', JSON.stringify(websites))
}

function urlValidation() {
    const regex = /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,25}){1,5}(?:\/.*)?$/

    if (regex.test(siteUrlInp.value)) {
        return true;
    } else {
        return false;
    }
}

function nameValidation() {
    const regex = /^[A-Za-z0-9 -_\.]{3,20}$/
    if (regex.test(siteNameInp.value)) {
        return true;
    } else {
        return false;
    }
}

function blockedCursorClass() {
    if (addBtn.classList.contains('blocked-cursor') && nameValidation() && urlValidation()) { addBtn.classList.remove('blocked-cursor') }
    else if (!addBtn.classList.contains('blocked-cursor') && !nameValidation() || !urlValidation()) { addBtn.classList.add('blocked-cursor') }
}

function display() {
    let websitesList = document.getElementById('websites-container')
    if (websites.length != 0) {
        webListContent = ``
        for (let i = 0; i < websites.length; i++) {
            webListContent += `
        <div class="website col-lg-4 col-md-6 p-2">
                <div class="link"><div class="anchor-content d-flex justify-content-center align-items-center text-center overflow-hidden position-relative"><a href="${websites[i].url}" target="_blank" class="w-100 py-2">${i + 1}.${websites[i].name}</a></div></div>
        </div>`
        }
        websitesList.innerHTML = webListContent;
        addAnchorsEvents();
        deleteBtn.style.display = 'block'
    } else {
        websitesList.innerHTML = '<div class="empty-section"></div>';
        deleteBtn.style.display = 'none'
    }
}

function anchorsHover(webIndex) {
    anchors[webIndex].innerHTML = ''
    let urlTxt = websites[webIndex].url
    let i = 0;
    let x;
    function typingEffect() {
        if (i < urlTxt.length) {
            anchors[webIndex].innerHTML += urlTxt.charAt(i);
            i++;
            x = setTimeout(typingEffect, 50);
        }
    }
    typingEffect()
    anchorContent[webIndex].addEventListener('pointerleave', function () {
        clearTimeout(x)
        anchors[webIndex].innerHTML = `${webIndex + 1}.${websites[webIndex].name}`
    })
}

function checkUrl() {
    if (siteUrlInp.value.startsWith('http://') || siteUrlInp.value.startsWith('https://')) {
        return siteUrlInp.value
    } else {
        return 'http://' + siteUrlInp.value
    }
}

function clearInputs() {
    siteNameInp.value = '';
    siteUrlInp.value = '';
    addBtn.classList.add('blocked-cursor')
}

function showDeleteOverlay() {
    let overlay, deleteBox, body;
    overlay = document.getElementById('delete-overlay')
    deleteBox = document.getElementById('delete-box')
    body = document.getElementsByTagName('body')[0]

    body.style.overflowY = 'hidden'
    setTimeout(() => { overlay.style.opacity = '1'; overlay.style.transform = 'scale(1)'; overlay.classList.replace('rounded-circle', 'rounded-0'); }, overlay.classList.replace('d-none', 'd-flex'))
    setTimeout(() => { deleteBox.style.opacity = '1'; deleteBox.style.transform = 'translateY(0)' }, 200)
}

function hideDeleteOverlay() {
    let overlay, deleteBox, deleteError, body;
    overlay = document.getElementById('delete-overlay');
    deleteBox = document.getElementById('delete-box');
    deleteError = document.getElementById('delete-box-error');
    body = document.getElementsByTagName('body')[0]
    body.style.overflowY = 'visible'
    deleteError.innerHTML = ''
    deleteBoxInput.value = ''
    setTimeout(() => { deleteBox.style.opacity = '0'; deleteBox.style.transform = 'translateY(-100%)' })
    setTimeout(() => { ; overlay.style.opacity = '0'; overlay.style.transform = 'scale(0)'; overlay.classList.replace('rounded-0', 'rounded-circle'); }, 200)
    setTimeout(() => { overlay.classList.replace('d-flex', 'd-none') }, 300)
}

function addAnchorsEvents() {
    const myWeb = `https://moatazbellah12.github.io/bookmarker/`
    for (let i = 0; i < websites.length; i++) {
        anchorContent[i].addEventListener('pointerenter', function () {
            anchorsHover(i);
        });
        if (navigator.share) {
            anchorContent[i].innerHTML += `<span class="anchor-icon position-absolute d-flex justify-content-center align-items-center"><i class="fas fa-share-alt"></i></span>`
            anchorIcon[i].addEventListener('click', async () => {
                await navigator.share({
                    title: websites[i].name,
                    url: websites[i].url,
                    text: `Check out this ${websites[i].name} website 🚀`
                });
            });
        }
    }
}

(function () {
    let spans = document.getElementsByClassName('spans');
    let span = ``
    for (let i = 0; i < 12; i++) {
        span += `<span>bookmarker</span> `
    }
    for (let i = 0; i < spans.length; i++) {
        spans[i].innerHTML = span
    }
})();
