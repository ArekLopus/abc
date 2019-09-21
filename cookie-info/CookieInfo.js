

class CookieInfo extends HTMLElement {
    constructor() {
        super();

        this.swRoot = this.attachShadow({ mode: 'open' });

        this.swRoot.appendChild(settings_js);
        this.swRoot.appendChild(settings_css);
        this.swRoot.appendChild(css);
        this.swRoot.appendChild(template);

        this.cimain = this.swRoot.querySelector('#cimain');
        this.citext = this.swRoot.querySelector('#ciInfoText');
        //this.cibuttons = this.swRoot.querySelector('#ciButtons');

        this.acceptBtn = this.swRoot.querySelector('#acceptBtn');
        this.rejectBtn = this.swRoot.querySelector('#rejectBtn');

        this.message = infoText;
        this.ciPosition = elementPosition;
        this.setCookie = set_cookie;
        this.rejectedURL = rejectedURL;
    }


    connectedCallback() {

        let acceptBtn = e => {
            
            if(this.ciPosition == 'up') {
                this.cimain.classList.toggle('accepted_up');
            } else {
                this.cimain.classList.toggle('accepted_down');
            }
            
            if(this.setCookie == true) {                        // Checks if number
                let isNr = /^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/.test(cookieDays);
                console.log('isNR: ', isNr);
                if(isNr == true) {
                    setCookie('cookiesInfo', 'accepted', cookieDays)
                } else {
                    setCookie('cookiesInfo', 'accepted', 365)
                }
                    
            }
            
        }

        let rejectBtn = e => {
            
            if(this.rejectedURL === '' || this.rejectedURL === 'none')
                this.cimain.style.display = "none";
            // Checks if proper URL format
            const matchURL = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(this.rejectedURL);
            
            if(matchURL == true)
                window.location.assign(this.rejectedURL);
        }

        this.acceptBtnListener = acceptBtn.bind(this);
        this.rejectBtnListener = rejectBtn.bind(this);

        this.acceptBtn.addEventListener("click", this.acceptBtnListener, false);
        this.rejectBtn.addEventListener("click", this.rejectBtnListener, false);
    }

    disconnectedCallback() {
        console.log('disconnectedCallback() called');
        this.acceptBtn.removeEventListener("click", this.acceptBtnListener, false);
        this.rejectBtn.removeEventListener("click", this.rejectBtnListener, false);
    }


    set message(txt) {
        if (txt != null && txt != '') {
            this.citext.innerHTML = txt;
        }
    }

    set position(pos) {
        if (pos == 'up') {
            // console.log('up');
            this.ciPosition = 'up'
            this.cimain.className = 'cimain cimain_up';

        } else if (pos == 'down') {
            // console.log('down');
            this.ciPosition = 'down'
            this.cimain.className = 'cimain cimain_down';
        } else {
            // console.log('down else');
            this.ciPosition = 'down'
            this.cimain.className = 'cimain cimain_down';
        }
    }

    set cookie(set) {
        //console.log('setting cookie: ', set);
        this.setCookie = set;
    }

    set rejected(url) {
        // console.log('rejected: ', url);
        this.rejectedURL = url;
    }
    
    static get observedAttributes() {
        return ["message", "position", "cookie", "rejected"];
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        //console.log(`attributeChangedCallback ${attr} ${oldVal} ${newVal}`);
        switch (attr) {
            case 'message':
                //console.log('message attr changed');
                this.message = newVal;
                break;
            case 'position':
                //console.log('position attr changed');
                this.position = newVal;
                break;
            case 'cookie':
                //console.log('cookie attr changed');
                let isTrueSet = (newVal == 'true');
                this.cookie = isTrueSet;
                break;
            case 'rejected':
                //console.log('rejected attr changed');
                this.rejected = newVal;
                break;
            default:
                console.log('default switch');
                break;
        }
    }
}



let settings_js;
let settings_css;
let template;
let css;
let path = getCurrentScriptPath();


(async function () {
    // if cookie exists, no need to initialize component
    let checkIfCookieExists = getCookie('cookiesInfo')
    //console.log('cookie: ', ci);
    if (checkIfCookieExists != null) {      
        return;
    }

    let getSett = await fetch(path + 'ci-settings-js');
    let sett = await getSett.text();
    let script = document.createElement('script');
    script.appendChild(document.createRange().createContextualFragment(sett));
    settings_js = script;

    let getTemp = await fetch(path + '/component/CookieInfo.htm');
    let temp = await getTemp.text();
    template = document.createRange().createContextualFragment(temp);
    
    let getSettCss = await fetch(path + 'ci-settings-css');
    let settCssTemp = await getSettCss.text();
    let styleSett = document.createElement('style');
    styleSett.appendChild(document.createRange().createContextualFragment(settCssTemp));
    settings_css = styleSett;

    let getCssTemp = await fetch(path + '/component/CookieInfo.css');
    let cssTemp = await getCssTemp.text();
    let style = document.createElement('style');
    style.appendChild(document.createRange().createContextualFragment(cssTemp));
    css = style;

    customElements.define('cookie-info', CookieInfo)
})();



function getCurrentScriptPath() {
    if (document.currentScript) {
        let fullPath = document.currentScript.src;
        return fullPath.substring(0, fullPath.lastIndexOf('/')+1);
    } else {
        let scripts = document.getElementsByTagName('script');
        let fullPath = scripts[scripts.length-1].src;
        return fullPath.substring(0, fullPath.lastIndexOf('/')+1);
    }
}



function setCookie(name, value, days) {
	let expires = "";
	if (days) {
		let date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + ";";
}

function getCookie(name) {
	let cookies = document.cookie;

	if (cookies.includes(name)) {
		return name;
	} else {
		return null;
	}
}
