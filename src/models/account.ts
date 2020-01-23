import { createSchema, Type, typedModel } from 'ts-mongoose'

const accountSchema = createSchema({
  customerId: Type.string({ required: true }),
  type: Type.string({ required: true }),
  balance: Type.number({ required: true })
})

const Account = typedModel('Account', accountSchema)

export { Account }
