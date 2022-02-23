export class Modal {

    constructor (audioManager, okAction) {
        this.okAction = okAction
        this.ifOkButton = typeof this.okAction === 'function' ? true : false
        this.audio = audioManager    
        this.id = 'modal-bg'
        this.window = this.generateElement()
        this.okAction = okAction

        setToDom(this.window, this.id)
        
        this.content = document.getElementById('modal')
        this.keyListeners = null
    }

    
    open = () => {
        if (!this.window.classList.contains('open')) {
            this.audio.openModal.play()
            this.window.classList.add('open')
            document.addEventListener('keydown', this.keyListener)
        }
    }
    
    
    close = (soundFlag) => {
        if (this.window.classList.contains('open')) {
            if (!this.window.classList.contains('close')) {
                this.window.classList.add('close')
                document.removeEventListener('keydown', this.keyListener)
                if (soundFlag) this.audio.closeModal.play()
                setTimeout(() => {
                    this.window.removeAttribute('class')
                    this.content.innerHTML = ''
                },500 )
            }
        }
    }

                    
    clear = () => this.content.innerHTML = ''


    setHeader = (h) => {
        const header = document.createElement('h3')
        header.innerHTML = h
        this.content.appendChild(header)
    }


    put = (content) => this.content.appendChild(content)


    generateElement = () => {
        const modal = document.createElement('div')
        modal.setAttribute('id', 'modal')
        
        const closeButton = document.createElement('button')
        closeButton.classList.add('close-button')
        closeButton.innerHTML = "zamknij"
        closeButton.addEventListener('click', () => this.close(true))

        const div = document.createElement('div')
        div.appendChild(modal)
        div.appendChild(this.getOkButton())
        div.appendChild(closeButton)
        
        const bg = document.createElement('div')
        bg.setAttribute('id', this.id)
        bg.appendChild(div)

        return bg
        
    }

    isOkButton = () => {
        const a = document.getElementById('modal')
        console.log(a)
    }


    getOkButton = () => {
        const okButton = document.createElement('button')
        okButton.innerHTML = "ok"
        okButton.addEventListener('click', (e) => this.onOk(e))
        okButton.setAttribute('id', 'ok-button')
        return okButton
    }


    removeOkButton = () => {
        const b = document.getElementById('ok-button')
        if (b) b.remove()
    }

    
    addOkButton = () => {
        const b = document.getElementById('ok-button')
        if (!b) {
            const closeButton = document.querySelector('#modal-bg > div > .close-button')
            const okButton = this.getOkButton()
            document.querySelector('#modal-bg > div').insertBefore(okButton, closeButton)
        }
    }


    onOk = (e) => {
        this.close(false)
        this.okAction(e)
    }


    keyListener = (e) => {
        if (e.code === 'Escape') {
            e.preventDefault()
            this.close()
        }
        else if (e.code === 'Enter') {
            e.preventDefault()
            this.okAction(e)
        }
            
    }

}

const setToDom = (element, id) => {
    if (!document.getElementById(id)) {
        document.body.appendChild(element)
    }
}