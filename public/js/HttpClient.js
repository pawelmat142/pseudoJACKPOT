export class HttpClient {

    constructor() {
        this.url = '/'
    }

    get sessionId() { return localStorage.getItem('sessionId') }


    // SESSION

    newSession = async () => {
        return await get(`${this.url}session`)
    }


    getSessionData = async () => {
        return await get(`${this.url}session/${this.sessionId}`)
    }


    stopSession = async () => {
        return await get(`${this.url}session/stop/${this.sessionId}`)
    }



    // BET

    betUp = async () => {
        return await get(`${this.url}betup/${this.sessionId}`)
    }

    betDown = async () => {
        return await get(`${this.url}betdown/${this.sessionId}`)
    }


    // SPIN

    spin = async () => {
        return await get(`${this.url}spin/${this.sessionId}`)
    }



    // TEST

    test = async () => {
        return await get(`${this.url}test`)
    }




    postTest = async (data) => {
        const url = this.url + 'test'
        try {
            let response = await fetch(url, { 
                method: 'POST',
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(data)
            })
            if (response.ok) {
                const data = await response.json()
                return data
            }
            else {
                throw new Error(response.status)
            }
        }
        catch (error) {
            return error
        }
    }


}


const get = async (url) => {
    try {
        let response = await fetch(url)
        if (response.ok) return await response.json()
        else throw new Error(response.status)
    }
    catch (error) {return error}
}


const post = async (url, data) => {
    try {
        let response = await fetch(url, { 
            method: 'POST',
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(data)
        })
        if (response.ok) return await response.json()
        else throw new Error(response.status)
    }
    catch (error) {return error}
}

