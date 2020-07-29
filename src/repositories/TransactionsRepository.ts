import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allTransactions = await this.find();

    const income = allTransactions.reduce(
      (accum, curr) => (curr.type === 'income' ? accum + curr.value : accum),
      0,
    );

    const outcome = allTransactions.reduce(
      (accum, curr) => (curr.type === 'outcome' ? accum + curr.value : accum),
      0,
    );

    const total = income - outcome;

    const balance: Balance = { income, outcome, total };

    return balance;
  }
}

export default TransactionsRepository;
