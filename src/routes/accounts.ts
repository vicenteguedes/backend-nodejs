import * as express from 'express'
import * as Joi from 'joi'
import * as mongoose from 'mongoose'
import { Account } from '../models/account'

const router = express()

router.get('/', async (req, res) => {
  const accounts = await Account.find()
  return res.send(accounts)
})

router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send('Invalid ID.')

  const account = await Account.findById(mongoose.Types.ObjectId(req.params.id))
  if (!account) return res.status(404).send('Account not found.')
  return res.send(account)
})

router.post('/create', async (req, res) => {
  const error = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const account = new Account({
    customerId: req.body.customerId,
    type: req.body.type,
    balance: req.body.balance ? req.body.balance : 0
  })

  await account.save()
  return res.send(account)
})

router.delete('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send('Invalid ID.')

  const account = await Account.findById(mongoose.Types.ObjectId(req.params.id))
  if (!account) return res.status(404).send('Account not found.')

  await account.remove()
  return res.send('Account removed successfully.')
})

function validate(body: object) {
  const schema = {
    // In real world applications, customerId would be a valid objectId, but here a simple string for testing.
    customerId: Joi.string().required(),
    type: Joi.string()
      .valid(['Conta Corrente', 'Conta Poupança'])
      .required(),
    balance: Joi.number()
  }

  const { error } = Joi.validate(body, schema)
  return error
}

export { router }
