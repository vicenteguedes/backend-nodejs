import * as request from 'supertest'
import { server } from '../src/server'
import { Account } from '../src/models/account'
import { Withdrawal } from '../src/models/withdrawal'
import * as mongoose from 'mongoose'

describe('/withdrawals', () => {
  let account: mongoose.Document & {
    type: string
    _id: mongoose.Types.ObjectId
    __v: number
    customerId: string
    balance: number
  } & {}
  let accountId: mongoose.Types.ObjectId

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
    await Withdrawal.remove({})
  })

  afterAll(async () => {
    server.close()
    mongoose.connection.close()
  })

  describe('GET /', () => {
    it('should return only one withdrawal, the one created in this function.', async () => {
      await Withdrawal.collection.insertOne({ accountId, amount: 300 })

      const res = await request(server).get('/withdrawals')
      expect(res.body.length).toBe(1)
    })
  })

  describe('POST /', () => {
    it('should return 400 if no accountId is provided', async () => {
      const res = await request(server)
        .post('/withdrawals')
        .send({ amount: 300 })
      expect(res.status).toBe(400)
    })

    it('should return 400 if no amount is provided', async () => {
      const res = await request(server)
        .post('/withdrawals')
        .send({ accountId })
      expect(res.status).toBe(400)
    })

    it('should return 404 if account does not exist', async () => {
      const res = await request(server)
        .post('/withdrawals')
        .send({ accountId: mongoose.Types.ObjectId(), amount: 300 })
      expect(res.status).toBe(404)
    })

    it('should return 400 if amount exceeds the B$ 600 limit', async () => {
      const res = await request(server)
        .post('/withdrawals')
        .send({ accountId, amount: 601 })
      expect(res.status).toBe(400)
    })

    it('should return 400 if amount plus fees exceeds the account balance', async () => {
      const res = await request(server)
        .post('/withdrawals')
        .send({ accountId, amount: 500 })
      expect(res.status).toBe(400)
    })

    it('should update the account balance if request is ok', async () => {
      const res = await request(server)
        .post('/withdrawals')
        .send({ accountId: accountId, amount: 300 })

      const account = await Account.findById(accountId)
      expect(account.balance).toBe(400 - 300 - 0.3)
    })
  })
})
