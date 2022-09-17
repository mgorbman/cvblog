const http = require('http')
const urlModule = require('url')

const { MongoClient, ObjectId } = require('mongodb')

const mongoURL = 'mongodb://127.0.0.1:27017'
const mongoClient = new MongoClient(mongoURL)

function createDate() {
    let date = new Date()
    return `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`
}

const blogPost_POST = (response, body, requestURL) => {
    // console.log(requestURL)
    const queryStr = urlModule.parse(requestURL, true).query

    return async () => {
        const parsedBody = JSON.parse(body)
        parsedBody.date = createDate()

        if (queryStr.isPost === 'true') {
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
            console.log(parsedBody)
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

const blogPost_PUT = (response, body) => {
    return async () => {
        const parsedBody = JSON.parse(body)

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
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, POST, GET, PUT, DELETE'
    )
    response.setHeader('Access-Control-Allow-Headers', '*')
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

            // console.log("body:" + body);
            // console.log(urlModule.parse(request.url, true).pathname);
            // console.log(urlModule.parse(request.url, true).pathname.split("/")[2])
            const resolver = {
                blogposts: {
                    POST: blogPost_POST(response, body, request.url),
                    PUT: blogPost_PUT(response, body),
                    GET: blogPost_GET(response, request),
                    DELETE: blogPost_DELETE(response),
                },
            }

            // console.log("request url:" + request.url);
            await resolver[
                urlModule.parse(request.url, true).pathname.split('/')[1]
            ][request.method]()
            response.end()
        })
}).listen(8080)
