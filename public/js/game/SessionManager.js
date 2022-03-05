export class SessionManager {

    constructor(http) {
        this.http = http
        this.ready = false

        const id = this.id
        if (id) this.id = id
    }

    set id(_id) {
        localStorage.setItem('sessionId', parseInt(_id))
        if (!!_id) this.addToSessions(_id)
        this.http.sessionId = _id
    }
    get id() {
        return localStorage.getItem('sessionId') ? parseInt(localStorage.getItem('sessionId')) : false
    }


    set sessions(array) {
        Array.isArray(array) ? localStorage.setItem('sessions', array) : console.log('set error')
    }
    get sessions() {
        const a = localStorage.getItem('sessions') ? localStorage.getItem('sessions').split(',') : false
        if (Array.isArray(a)) return a.map(x => parseInt(x))
        else return false
    }


    init = async () => {
        const sessionData = await this.http.getSessionData()
        this.id = sessionData.id
        this.ready = true
        return sessionData
    }

    
    reset = async () => {
        const stopped = await this.http.stopSession()
        if (stopped) {
            this.id = false
            const sessionData = await this.http.getSessionData()
            this.id = sessionData.id
            return sessionData
        } else console.log('reset error')
    }


    addToSessions = (id) => {
        if (this.sessions) {
            if (this.sessions.includes(id)) console.log('includes')
            else this.sessions = [...this.sessions, id]
        } else this.sessions = [id]
    }
    
    
    removeFromSessions = (id) => {
        const result = Array.isArray(this.sessions) ? this.sessions.filter(s=>s!==id) : this.sessions
        this.sessions = result
    }

} 
