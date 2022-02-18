export class Modal {

    constructor () {
        this.id = 'modal-bg'
        this.window = this.generateElement()
        
        setToDom(this.window, this.id)

    }

    open = () => {
        if (!this.window.classList.contains('open')) {
            this.window.classList.add('open')
        }
    }

    close = () => {
        if (this.window.classList.contains('open')) {
            if (!this.window.classList.contains('close')) {
                this.window.classList.add('close')
                setTimeout(() => this.window.removeAttribute('class'), 500)
            }
        }
    }

    generateElement = () => {
        const modal = document.createElement('div')
        modal.setAttribute('id', 'modal')
        
        const closeButton = document.createElement('div')
        closeButton.classList.add('close-button')
        closeButton.innerHTML = "zamknij"
        closeButton.addEventListener('click', () => this.close())
        
        const div = document.createElement('div')
        div.appendChild(modal)
        div.appendChild(closeButton)
        
        const bg = document.createElement('div')
        bg.setAttribute('id', this.id)
        bg.appendChild(div)

        return bg
    }


}

const setToDom = (element, id) => {
    if (!document.getElementById(id)) {
        document.body.appendChild(element)
    }
}