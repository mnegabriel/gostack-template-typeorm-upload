import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import DeleteTransactionService from '../services/DeleteTransactionService';

// import TransactionsRepository from '../repositories/TransactionsRepository';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();

  const categoriesRepository = getRepository(Category);
  const categories = await categoriesRepository.find();

  const formattedTransactions = transactions.map(listItem => {
    const category = categories.find(tag => tag.id === listItem.category_id);
    const newTransactionFormat = { ...listItem, category };
    delete newTransactionFormat.category_id;
    return newTransactionFormat;
  });

  // const fullGetResponse =

  return response.json(formattedTransactions);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.status(204).send();
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
