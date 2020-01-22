import * as express from "express";
import * as Joi from "joi";

const router = express();

interface Account {
  id: string;
  customerId: string;
  type: string;
  balance?: number;
}

const accounts: Account[] = [
  { customerId: "0", id: "1", balance: 900, type: "Conta Poupança" },
  { customerId: "1", id: "2", balance: 100, type: "Conta Corrente" },
  { customerId: "2", id: "3", balance: 0.2, type: "Conta Corrente" }
];

router.get("/", (req, res) => {
  return res.send(accounts);
});

router.get("/:id", (req, res) => {
  const account = accounts.find(a => a.id === req.params.id);
  if (!account) return res.status(404).send("Account not found.");
  return res.send(account);
});

router.post("/create", (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const account: Account = {
    customerId: req.body.customerId,
    type: req.body.type,
    id: (accounts.length + 1).toString()
  };

  if (req.body.balance) {
    account.balance = req.body.balance;
  } else {
    account.balance = 0;
  }

  accounts.push(account);
  return res.send(account);
});

function validate(body: object) {
  const schema = {
    customerId: Joi.string().required(),
    type: Joi.string()
      .valid(["Conta Corrente", "Conta Poupança"])
      .required(),
    balance: Joi.number()
  };

  const { error } = Joi.validate(body, schema);
  return error;
}

export { router, accounts };
