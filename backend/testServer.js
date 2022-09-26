const http = require('http')
const urlModule = require('url')

const { MongoClient, ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const { on } = require('events')

const mongoURL = 'mongodb://127.0.0.1:27017'
const mongoClient = new MongoClient(mongoURL)
const secretString =
    'fbcfba53b4854526d105282a36d34ed919fcc34c86b3ca020411898b3e38cefcb2f7a3434af50ad0102320251d32506ed4d87855c0659f9f7de31055dd9e2709'

const token_POST = (response, { user, password }) => {
    return async () => {
        const accessToken = jwt.sign({ user, password }, secretString, {
            expiresIn: '3600000',
        })
        response.setHeader('Set-Cookie', `Auth=${accessToken}`)
        response.end()
    }
}

// const verify = (token) => {
//     try {
//         jwt.verify(token, secretString)
//         return true
//     } catch (e) {
//         return false
//     }
// }

const verifyRequest = (cookie, secretString) => {
    if (!cookie) return false

    const authToken = cookie
        .split(' ')
        .find((cookie) => cookie.startsWith('Auth='))
        .split('Auth=')[1]
    try {
        jwt.verify(authToken, secretString)
        return true
    } catch (e) {
        return false
    }
}
// async function tryAuth(response, request) {
//     const data = authorize_GET(response, request)
//     console.log(await data())
//     return
//     const valid = (await data().json()).valid
//     return valid
// }

const blogPost_POST = (response, body, requestURL, request) => {
    const queryStr = urlModule.parse(requestURL, true).query

    return async () => {
        const parsedBody = JSON.parse(body)
        parsedBody.date = new Date().toISOString()

        if (!verifyRequest(request.headers.cookie, secretString)) {
            response.statusCode = 401
            return response.end()
        }

        if (queryStr.isPost === 'true') {
            // const authToken = request.headers.cookie
            //     .split(' ')
            //     .find((cookie) => cookie.startsWith('Auth='))
            //     .split('Auth=')[1]

            // console.log(jwt.verify(authToken, secretString))
            let postURL = parsedBody.title.toLowerCase()
            postURL = postURL.replaceAll(' ', '_')
            postURL = `${postURL}-${parsedBody.date}`
            parsedBody.url = postURL
            parsedBody.comments = []

            await mongoClient
                .db('posts')
                .collection('entries')
                .insertOne(parsedBody)
            response.write(JSON.stringify(parsedBody))
            response.end()
        }
        if (queryStr.isPost === 'false') {
            const x = new ObjectId()
            await mongoClient
                .db('posts')
                .collection('entries')
                .updateOne(
                    {
                        url: urlModule
                            .parse(requestURL, true)
                            .pathname.split('/blogposts/')[1],
                    },
                    {
                        $push: {
                            comments: {
                                ...parsedBody,
                                _id: x,
                            },
                        },
                    }
                )
            response.write(JSON.stringify({ date: parsedBody.date, _id: x }))
            response.end()
        }
    }
}

const blogPost_PUT = (request, response, body) => {
    return async () => {
        const parsedBody = JSON.parse(body)

        if (!verifyRequest(request.headers.cookie, secretString)) {
            response.statusCode = 401
            return response.end()
        }

        await mongoClient
            .db('posts')
            .collection('entries')
            .updateOne(
                { _id: ObjectId(parsedBody.id) },
                { $set: { content: parsedBody.content } }
            )
        response.write(JSON.stringify(parsedBody))
    }
}

const blogPost_GET = (response, request) => {
    return async () => {
        const url = request.url.split('/')
        const queryStr = urlModule.parse(request.url, true).query
        const pathStr = urlModule.parse(request.url, true).pathname
        const entriesCollection = mongoClient.db('posts').collection('entries')

        let result
        if (url.length === 3) {
            let options
            if (queryStr.commentsOnly === 'true') {
                options = { projection: { comments: 1, _id: 0 } }
            }

            if (queryStr.ignoreComments === 'true') {
                options = { projection: { comments: 0 } }
            }
            result = await entriesCollection.findOne(
                { url: pathStr.split('/')[2] },
                options
            )
        } else {
            result = await entriesCollection.find({}).toArray()
        }
        response.write(JSON.stringify(result))
    }
}

const blogPost_DELETE = async () => () => null

http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, POST, GET, PUT, DELETE'
    )
    response.setHeader('Access-Control-Allow-Headers', '*')
    response.setHeader('Access-Control-Allow-Credentials', true)
    response.setHeader('Access-Control-Max-Age', 2592000)
    if (request.method === 'OPTIONS') {
        response.end()
        return
    }

    // During events, data streams (strings) are pushed into the body constant. by the "end" event, all strings are concatenated
    // and const 'body' holds the complete version of the sent data.
    let body = []
    request
        .on('error', (err) => {
            console.error(err)
        })
        .on('data', (chunk) => {
            body.push(chunk)
        })
        .on('end', async () => {
            body = Buffer.concat(body).toString()

            response.on('error', (err) => {
                console.error(err)
            })

            response.statusCode = 200
            response.setHeader('Content-Type', 'application/json')

            const resolver = {
                blogposts: {
                    POST: blogPost_POST(response, body, request.url, request),
                    PUT: blogPost_PUT(request, response, body),
                    GET: blogPost_GET(response, request),
                    DELETE: blogPost_DELETE(response),
                },
                login: {
                    POST: token_POST(response, body),
                },
            }
            await resolver[
                urlModule.parse(request.url, true).pathname.split('/')[1]
            ][request.method]()
            response.end()
        })
}).listen(8080)
