export class Modal {

    constructor (audioManager, okAction) {
        this.audio = audioManager
        this.id = 'modal-bg'
        this.window = this.generateElement()
        this.okAction = okAction

        setToDom(this.window, this.id)
        
        this.content = document.querySelector('#modal-bg #modal')
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
        closeButton.addEventListener('key', (e) => console.log(e))

        const okButton = document.createElement('button')
        okButton.innerHTML = "ok"
        okButton.addEventListener('click', (e) => this.onOk(e))

        const div = document.createElement('div')
        div.appendChild(modal)
        div.appendChild(okButton)
        div.appendChild(closeButton)
        
        const bg = document.createElement('div')
        bg.setAttribute('id', this.id)
        bg.appendChild(div)

        return bg
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