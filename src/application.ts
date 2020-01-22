import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as dotenv from 'dotenv'
import { router as deposit } from './routes/deposit'
import { router as withdrawal } from './routes/withdrawal'
import { router as account } from './routes/account'

dotenv.config()

const application = express()

application.use(bodyParser.text())
application.use(express.json())
application.use(express.urlencoded({ extended: false }))
application.use(cors())
application.use('/deposit', deposit)
application.use('/withdrawal', withdrawal)
application.use('/account', account)

application.get('/', (req, res) => {
    res.send('Hello World!')
})

application.set('port', process.env.APP_PORT || 5000)

export { application }