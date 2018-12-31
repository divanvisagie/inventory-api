const { expect } = require('chai')
const fetch = require('node-fetch')
const debug = require('debug')('e2e:userflow')

const root = 'http://localhost:3000'

class ApiRequest {
    constructor(endpoint) {
        this.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        this.endpoint = endpoint
    }

    withToken (token) {
        this.headers['Authorization'] = `Bearer ${token}`
        return this
    }

    async execute () {
        const url = `${root}${this.endpoint}`

        const fetchOptions = {
            method: this.method,
            headers: this.headers,
        }

        if (this.body) {
            fetchOptions.body = this.body
        }

        const response = await fetch(url, fetchOptions).then(r => {
            return r
        }).catch(e => {
            console.error(e)
        })
        return response
    }
}


const api = {
    


    get(endpoint) {
        class Get extends ApiRequest {
            constructor (endpoint) {
                super(endpoint)
                this.method = 'GET'
            }
        }
        return new Get(endpoint)
    },
    post(endpoint) {
        class Post extends ApiRequest {
            constructor(endpoint) {
                super(endpoint)
                this.method = 'POST'
            }

            withBody (body) {
                this.body = JSON.stringify(body)
                return this
            }
        }
        return new Post(endpoint)
    }
}

describe('Attempting routes without token', () => {

    describe('GET /api/v1/user/profile without token', () => {
        let response 
        before(async ()=> {
            response = await api.get('/api/v1/user/profile')
                .execute()
        })
       
        it('responds with status 401', async () => {
            expect(response.status).to.be.eq(401)
        })

        it('responds with Unauthorized body', async() => {
            expect(await response.text()).to.be.eq('Unauthorized')
        })

    })
})

describe('Userflow', () => {
    let token

    describe('POST /api/v1/auth/signup with correct body', () => {
        let response
        before(async () => {
            response = await api.post('/api/v1/auth/signup')
                .withBody({
                    email: 'fukeuser@gmail.com',
                    password: 'test'
                })
                .execute()
        })

        it('responds with status 200 or 400', async () => {
            expect([200, 401]).to.contain(response.status)
        })
    })

    describe('POST /api/v1/auth/login', () => {
        let response
        let body
        before(async () => {
            response = await api.post('/api/v1/auth/login')
                .withBody({
                    email: 'fukeuser@gmail.com',
                    password: 'test'
                })
                .execute()
            body = await response.json()
            token = body.token
            debug(token)
        })

        it('response with status 200', () => {
            expect(response.status).to.be.eq(200)
        })

        it('responds with json object containing token key', () => {
            expect(body).to.have.property('token')
        })
    })

    describe('GET /api/v1/user/profile with token', () => {
        let response 
        let body
        before(async () => {
            response = await api.get('/api/v1/user/profile')
                .withToken(token)
                .execute()
            body = await response.json()
        })
       
        it('responds with status 200', async () => {
            expect(response.status).to.be.eq(200)
        })

        it('responds with Unauthorized body', async() => {
            expect(body).to.have.property('message')
        })   

    })
})