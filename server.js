const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { graphqlExpress } = require('apollo-server-express')
const { GraphQLSchema, execute, subscribe } = require('graphql') 
const { createServer } = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const expressPlayground = require('graphql-playground-middleware-express').default
const mongoose = require('mongoose')
const multer = require('multer')
const session = require('express-session')
const redis = require('redis')
const RedisStore = require('connect-redis')(session)
const bodyParser = require('body-parser')
const cors = require('cors')
const Query = require('./types/Query')
const Mutation = require('./types/Mutation')
const Subscription = require('./types/Subscription')

const pubsub = require('./lib/pubsub')
const graphqlEndpoint = '/graphql'
const subscriptionEndpoint = '/subscriptions'

mongoose.connect('mongodb://root:root@mongo:27017/billion_dollar_app?authSource=admin', {
  useNewUrlParser: true
})

const port = 3000

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  // we're connected!
  console.log('CONNECTED!!!')
})

// Construct a schema, using GraphQL schema language
const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription
})

const app = express()

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
  credentials: true
}))

const redisClient = redis.createClient({
  host: 'redis',
  port: 6379
}).on('error', (err) => console.error('ERR:REDIS:', err))

const expressSession = session({
  store: new RedisStore({ client: redisClient, disableTTL: true }),
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  cookie: { expires: false, path: '/' },
  saveUninitialized: true,
  rolling: true,
  name: 'connect.sess'
})

app.use(expressSession)

const upload = multer({
  dest: 'uploads/',
})

app.use(
  graphqlEndpoint, 
  bodyParser.json(), 
  upload.any(),
  graphqlExpress((req, res) => {
    const { session } = req
    return {
      schema: schema,
      context: {
        res,
        req,
        session
      }, 
    }  
  })
)

app.get('/playground', expressPlayground({ 
  endpoint: graphqlEndpoint, 
  subscriptionEndpoint
}))

const ws = createServer(app)

ws.listen(port, () => {
  console.log(`Running a GraphQL API server at localhost:${port}${graphqlEndpoint}`)
  new SubscriptionServer({
    execute,
    subscribe,
    schema,
    onConnect: (connectionParams, webSocket) => {
      return new Promise((resolve) => {
        expressSession(webSocket.upgradeReq, {}, () => {
          const { session } = webSocket.upgradeReq
          
          const context = {
            pubsub,
            session
          }

          resolve(context)
        })
      })
    }
  }, {
    server: ws,
    path: subscriptionEndpoint
  })
})