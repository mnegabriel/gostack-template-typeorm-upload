import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    //
    const csvFilePath = path.join(uploadConfig.directory, fileName);
    // const csvFilePath = path.resolve(__dirname, '..', '..', 'tmp', fileName);
    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: Array<Array<string>> = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const objectData = lines.map(line => {
      const object = {
        title: line[0],
        value: parseInt(line[2], 10),
        type: line[1],
        category: line[3],
      };
      return object;
    });

    // const csvFilePath

    const createTransaction = new CreateTransactionService();

    const transactions: Transaction[] = [];

    for (const { title, value, type, category } of objectData) {
      const transaction: Transaction = await createTransaction.execute({
        title,
        value,
        type,
        category,
      });
      transactions.push(transaction);
    }

    await fs.promises.unlink(csvFilePath);

    // const transactions = objectData.map(object => {
    //   const { title, value, type, category } = object;
    //   const transaction: Transaction = createTransaction.execute({
    //     title,
    //     value,
    //     type,
    //     category,
    //   });
    //   return transaction;
    // });
    return transactions;
  }
}

export default ImportTransactionsService;
