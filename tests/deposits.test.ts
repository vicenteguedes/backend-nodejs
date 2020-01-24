import * as request from 'supertest'
import { server } from '../src/server'
import { Account } from '../src/models/account'
import { Deposit } from '../src/models/deposit'
import * as mongoose from 'mongoose'

describe('/deposits', () => {
  let account: mongoose.Document & {
    type: string
    _id: mongoose.Types.ObjectId
    __v: number
    customerId: string
    balance: number
  } & {}
  let accountId: mongoose.Types.ObjectId
  let deposit: mongoose.Document & {
    _id: mongoose.Types.ObjectId
    __v: number
    accountId: string
    amount: number
    date: Date
  } & {}
  let depositId: mongoose.Types.ObjectId

  beforeEach(async () => {
    accountId = mongoose.Types.ObjectId()

    account = new Account({
      _id: accountId,
      customerId: '1',
      type: 'Conta Poupança',
      balance: 400
    })

    await account.save()
  })

  afterEach(async () => {
    await Account.remove({})
    await Deposit.remove({})
  })

  afterAll(async () => {
    server.close()
    mongoose.connection.close()
  })

  describe('GET /', () => {
    it('should return only one deposit, the one created in this function.', async () => {
      await Deposit.collection.insertOne({ accountId, amount: 300 })

      const res = await request(server).get('/deposits')
      expect(res.body.length).toBe(1)
    })
  })

  describe('POST /', () => {
    it('should return 400 if no accountId is provided', async () => {
      const res = await request(server)
        .post('/deposits')
        .send({ amount: 300 })
      expect(res.status).toBe(400)
    })

    it('should return 400 if no amount is provided', async () => {
      const res = await request(server)
        .post('/deposits')
        .send({ accountId })
      expect(res.status).toBe(400)
    })

    it('should return 404 if account does not exist', async () => {
      const res = await request(server)
        .post('/deposits')
        .send({ accountId: mongoose.Types.ObjectId(), amount: 300 })
      expect(res.status).toBe(404)
    })

    it('should update the account balance if request is ok', async () => {
      const res = await request(server)
        .post('/deposits')
        .send({ accountId: accountId, amount: 300 })

      const account = await Account.findById(accountId)
      expect(account.balance).toBe(400 + 300)
    })
  })
})
