import { getCustomRepository, getRepository } from 'typeorm';
import { Router } from 'express';
import multer from 'multer';

import Category from '../models/Category';
import uploadConfig from '../config/upload';

import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const allTransactions = await transactionsRepository.find();

  const categoriesRepository = getRepository(Category);
  const categories = await categoriesRepository.find();

  const transactions = allTransactions.map(listItem => {
    const category = categories.find(tag => tag.id === listItem.category_id);
    const newTransactionFormat = { ...listItem, category };
    delete newTransactionFormat.category_id;
    return newTransactionFormat;
  });

  const balance = await transactionsRepository.getBalance();

  const fullGetResponse = { transactions, balance };

  return response.json(fullGetResponse);
});

transactionsRouter.post('/', async (request, response) => {
  try {
    const { title, value, type, category } = request.body;

    const createTransaction = new CreateTransactionService();

    const transaction = await createTransaction.execute({
      title,
      value,
      type,
      category,
    });

    return response.json(transaction);
  } catch (err) {
    return response.status(400).send({ message: err.message, status: 'error' });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const { filename } = request.file;

    const importTransactions = new ImportTransactionsService();
    const imported = await importTransactions.execute(filename);

    return response.json(imported);
  },
);

export default transactionsRouter;
