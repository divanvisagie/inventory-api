const fetch = require('node-fetch')
const debug = require('debug')('e2e:api-inspector')

const api = (root) => {

    class ApiRequest {
        constructor(endpoint) {
            this.headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            this.endpoint = endpoint
        }

        withToken(token) {
            this.headers['Authorization'] = `Bearer ${token}`
            return this
        }

        async execute() {
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

    return {
        get(endpoint) {
            class Get extends ApiRequest {
                constructor(endpoint) {
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

                withBody(body) {
                    this.body = JSON.stringify(body)
                    return this
                }
            }
            return new Post(endpoint)
        }
    }
}

module.exports = api