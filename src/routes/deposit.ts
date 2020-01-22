import * as express from 'express'
import * as Joi from 'joi'
import { accounts } from './account'

const router = express()

router.post('/', (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const account = accounts.find(a => a.id === req.body.accountId)
    if (!account) return res.status(404).send('Account not found.')
    
    account.balance += req.body.amount
    return res.send(account)
})

function validate(body: object) {
    const schema = {
        accountId: Joi.string().required(),
        amount: Joi.number().required()
    };

    const { error } = Joi.validate(body, schema);
    return error
}

export { router }