export class HttpClient {

    constructor() {

        this.url = ''

        this._sessionId = -1

    }

    get sessionId() { return this._sessionId }

    set sessionId(id) { this._sessionId = id }

    
    // SESSION

    getSessionData = async (_id) => {
        if (this.sessionId < 0) {
            this.sessionId = await get(`${this.url}session`)
        }
        return await get(`${this.url}session/${this.sessionId}`)
    }


    getSessions = async (_ids) => {
        return await get(`${this.url}sessions/${_ids}`)
    }


    stopSession = async () => {
        return await get(`${this.url}session/stop/${this.sessionId}`)
    }


    sessionSpins = async (sessionId) => {
        return await get(`${this.url}session/${sessionId}/spins`)
    }


    // BET

    betUp = async () => {
        return await get(`${this.url}betup/${this.sessionId}`)
    }

    betDown = async () => {
        return await get(`${this.url}betdown/${this.sessionId}`)
    }


    // TRANSFER

    transfer = async (data) => {
        return await post(`${this.url}transfer/${this.sessionId}`, data)
    }


    // SPIN

    spin = async () => {
        return await get(`${this.url}spin/${this.sessionId}`)
    }


}


const get = async (url) => {
    try {
        let response = await fetch(url)
        if (response.status === 204) return await response.status
        if (response.ok) {
            return await response.json()
        }
        else throw new Error(response.status)
    }
    catch (error) {
        console.log(error.message)
        return error 
    }
}


const post = async (url, data) => {
    try {
        let response = await fetch(url, { 
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(data)
        })
        if (response.ok) return await response.json()
        else throw new Error(response.status)
    }
    catch (error) {
        console.log(error)
        return error
    }
}




