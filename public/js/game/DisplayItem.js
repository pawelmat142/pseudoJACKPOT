export class DisplayItem {

    constructor (DOMid, initValue) {
        this.DOM = document.getElementById(DOMid)
        this.DOM.innerHTML = initValue
        this.value = initValue
    }

    set = (newValue) => {
        this.DOM.innerHTML = newValue
        this.value = newValue
    }
    get = () => {
        return this.value
    }

}