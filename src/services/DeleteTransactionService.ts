// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionToRemove = await transactionsRepository.findOne({
      where: { id },
    });

    if (!transactionToRemove) {
      throw new Error('Transaction not found');
    }

    await transactionsRepository.remove(transactionToRemove);
  }
}

export default DeleteTransactionService;
