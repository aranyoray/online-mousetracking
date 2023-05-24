class Page {

    constructor() {
        this.generic_section = document.getElementById("generic_section");
        this.instruction_section = document.getElementById("instructions_section");
        this.trials_section = document.getElementById("trials_section");

        this.all_section = []
        this.#addSectionToPage(this.generic_section);
        this.#addSectionToPage(this.instruction_section);
        this.#addSectionToPage(this.trials_section);
    }

    static get StatusError() {
        return "ERROR";
    }

    static get StatusSuccess() {
        return "SUCCESS";
    }

    static hideElement(element) {
        element.style.display = 'none';
    }

    static showElement(element) {
        element.style.display = 'block';
    }

    #addSectionToPage(section) {
        this.all_section.push(section);
    }

    #toggleSectionAsVisible(visible_section) {
        for (const section of this.all_section) {
            if (section === visible_section) {
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }
        }
    }

    hideAll() {
        for (const section of this.all_section) {
            section.style.display = "none";
        }
    }

    showGeneric() {
        this.#toggleSectionAsVisible(this.generic_section);
    }

    showInstructions() {
        this.#toggleSectionAsVisible(this.instruction_section);
    }

    showTrials() {
        this.#toggleSectionAsVisible(this.trials_section);
    }
}


class Utils {
    static goFullscreen(element) {
        if (element.requestFullscreen)
            element.requestFullscreen();
        else if (element.mozRequestFullScreen)
            element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen)
            element.webkitRequestFullscreen();
        else if (element.msRequestFullscreen)
            element.msRequestFullscreen();
    }

    static leaveFullscreen() {
        if (document.exitFullscreen)
            document.exitFullscreen().then(r => console.log("leaving fullscreen"));
        else if (document.mozCancelFullScreen)
            document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen)
            document.webkitExitFullscreen();
        else if (document.msExitFullscreen)
            document.msExitFullscreen();
    }

    static isFullScreenCurrently() {
        let full_screen_element = document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement || null;

        return full_screen_element !== null;
    }

    static isMobileTablet() {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }
}


class Toast {

    constructor(root_div_name="full_screen_element") {

        this.root_div_name = root_div_name;

        this.defaultOpts = {
            type: 'log',
            position: 'tr',
            animate: 'fade', // slide
            duration: 3000,
            progress: false,
            holding: false,
            closeBtn: true,
            onClick: null,
            onClose: null
        }

        document.addEventListener('click', this.closeTaTa, false)

        this.tatas = []

        this.addIconsLink('https://fonts.googleapis.com/icon?family=Material+Icons');
    }

    randomId() {
        return `tata-${Date.now()}`
    }

    addIconsLink(href) {
        const iconLink = document.createElement('link')
        iconLink.rel = 'stylesheet'
        iconLink.href = href
        document.head.appendChild(iconLink)
    }

    mapPosition(pos = 'tr') {
        switch (pos) {
            case 'tr':
                return 'top-right'
            case 'tm':
                return 'top-mid'
            case 'tl':
                return 'top-left'
            case 'mr':
                return 'mid-right'
            case 'mm':
                return 'mid-mid'
            case 'ml':
                return 'mid-left'
            case 'br':
                return 'bottom-right'
            case 'bm':
                return 'bottom-mid'
            case 'bl':
                return 'bottom-left'
            default:
                return 'top-right'
        }
    }

    type2Icon(type = 'text') {
        switch (type) {
            case 'text':
                return 'chat_bubble'
            case 'log':
                return 'textsms'
            case 'info':
                return 'forum'
            case 'warn':
                return 'info_outline'
            case 'success':
                return 'check'
            case 'error':
                return 'block'
            case 'ask':
                return 'help_outline'
            default:
                return ''
        }
    }

    mapAnimateIn(animate = 'fade', position = 'tr') {
        if (animate === 'slide') {
            switch (position) {
                case 'tr':
                case 'mr':
                case 'br':
                    return 'slide-right-in'
                case 'tl':
                case 'ml':
                case 'bl':
                    return 'slide-left-in'
                case 'tm':
                    return 'slide-top-in'
                case 'bm':
                    return 'slide-bottom-in'
            }
        }
        return 'fade-in'
    }

    mapAnimateOut(animate = 'fade', position = 'tr') {
        if (animate === 'slide') {
            switch (position) {
                case 'tr':
                case 'mr':
                case 'br':
                    return 'slide-right-out'
                case 'tl':
                case 'ml':
                case 'bl':
                    return 'slide-left-out'
                case 'tm':
                    return 'slide-top-out'
                case 'bm':
                    return 'slide-bottom-out'
            }
        }
        return 'fade-out'
    }

    closeTaTa(event) {
        const target = event.target
        if (!target.classList.contains('tata-close')) return
        const id = target.parentNode.getAttribute('id')
        const ta = tatas.find(ta => ta.id === id)
        const element = document.getElementById(id)

        element.classList.add(this.mapAnimateOut(ta.opts.animate, ta.opts.position))
        this.removeElement(element)

        !!ta.opts.onClose &&
        typeof ta.opts.onClose === 'function' &&
        ta.opts.onClose.call(ta)
    }

    removeElement(element) {
       const timeout = setTimeout(() => {
           if (typeof element.remove === 'function') {
                element.remove()
            } else {
                document.body.removeChild(element)
           }
           clearTimeout(timeout)
        }, 800)
    }

    render(title, text, opts) {
        const id = this.randomId()
        const icon = this.type2Icon(opts.type)
        const position = this.mapPosition(opts.position)
        const animate = this.mapAnimateIn(opts.animate, opts.position)
        const ta = {title, text, opts, id}
        const idx = this.tatas.findIndex(tata => tata.id === id)
        const prevTa = idx === 0 ? null : this.tatas[idx - 1]
        this.tatas.push(ta)

        const template = `<div class="tata ${opts.type} ${animate} ${position}" id=${id}>
                          <i class="tata-icon material-icons">${icon}</i>
                          <div class="tata-body">
                          <h4 class="tata-title">${title}</h4>
                          <p class="tata-text">${text}</p>
                          </div>
                              ${opts.closeBtn || opts.holding ?
                                  '<button class="tata-close material-icons">clear</button>' : ''
                              }
                              ${!opts.holding && opts.progress ?
                                  '<div class="tata-progress"></div>' : ''
                              }
                          </div>`

        document.getElementById(this.root_div_name).insertAdjacentHTML('beforeend', template);

        if (prevTa && prevTa.opts.position === ta.opts.position) {
            this.removeElement(document.getElementById(prevTa.id))
        }

        const element = document.getElementById(id)

        !!opts.onClick &&
        typeof opts.onClick === 'function' &&
        element.addEventListener('click', function (event) {
            const target = event.target
            if (target.classList.contains('tata-close')) return
            this.opts.onClick.call(ta)
        }.bind(ta), {capture: true, once: true});

        if (!opts.holding && opts.progress) {
            const progress = element.querySelector('.tata-progress')
            progress.style.animation = `${opts.duration / 1000}s reduceWidth linear forwards`

            const vanish = setTimeout(() => {
                const idx = this.tatas.findIndex(t => t.id === ta.id)
                this.tatas.splice(idx, 1)
                element.classList.add(this.mapAnimateOut(ta.opts.animate, ta.opts.position))
                this.removeElement(element)
                clearTimeout(vanish)
                !!ta.opts.onClose &&
                typeof ta.opts.onClose === 'function' &&
                ta.opts.onClose.call(ta)
            }, opts.duration)

        }
    }

    text(title = '你好', text = '今天是' + new Date().toLocaleString(), opts = {}) {
        const _opts = Object.assign({}, this.defaultOpts, opts, {type: 'text'})
        this.render(title, text, _opts)
    }

    log(title = '你好', text = '今天是' + new Date().toLocaleString(), opts = {}) {
        const _opts = Object.assign({}, this.defaultOpts, opts, {type: 'log'})
        this.render(title, text, _opts)
    }

    info(title = '你好', text = '今天是' + new Date().toLocaleString(), opts = {}) {
        const _opts = Object.assign({}, this.defaultOpts, opts, {type: 'info'})
        this.render(title, text, _opts)
    }

    warn(title = '你好', text = '今天是' + new Date().toLocaleString(), opts = {}) {
        const _opts = Object.assign({}, this.defaultOpts, opts, {type: 'warn'})
        this.render(title, text, _opts)
    }

    error(title = '你好', text = '今天是' + new Date().toLocaleString(), opts = {}) {
        const _opts = Object.assign({}, this.defaultOpts, opts, {type: 'error'})
        this.render(title, text, _opts)
    }

    success(title = '你好', text = '今天是' + new Date().toLocaleString(), opts = {}) {
        const _opts = Object.assign({}, this.defaultOpts, opts, {type: 'success'})
        this.render(title, text, _opts)
    }

    ask() {
        const _opts = Object.assign({}, this.defaultOpts, opts, {type: 'ask'})
        this.render(title, text, _opts)
    }

    clear() {
        var elements = document.querySelectorAll('[id^="tata-"]');
        elements.forEach(function(element) {
          element.parentNode.removeChild(element);
        });
       // this.tatas.forEach(tata => this.removeElement(document.getElementById(tata.id)))
       // this.tatas.length = 0
    }
}