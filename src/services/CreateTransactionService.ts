// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
// import { PrimaryGeneratedColumnUUIDOptions } from 'typeorm/decorator/options/PrimaryGeneratedColumnUUIDOptions';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
  type: string;
  value: number;
  category: string;
}

// interface MiddleDTO{}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: RequestDTO): Promise<Transaction> {
    if (type !== 'income' && type !== 'outcome') {
      throw new Error('Invalid transaction type.');
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const categoryExist = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (categoryExist) {
      const unlinkedTransaction = transactionsRepository.create({
        title,
        type,
        value,
        category_id: categoryExist.id,
      });

      await transactionsRepository.save(unlinkedTransaction);
      return unlinkedTransaction;
    }

    const newCategory = categoriesRepository.create({ title: category });
    await categoriesRepository.save(newCategory);

    const linkedTransaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: newCategory.id,
    });
    await transactionsRepository.save(linkedTransaction);
    return linkedTransaction;
  }
}

export default CreateTransactionService;
