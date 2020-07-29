import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    // async function loadCSV(fileName: string): any[] {
    const csvFilePath = path.resolve(__dirname, '..', '..', 'tmp', fileName);
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
        value: line[2],
        type: line[1],
        category: line[3],
      };
      return object;
    });

    console.log(objectData);

    const createTransaction = new CreateTransactionService();

    // try {
    const transactions = await Promise.all(
      objectData.map(async object => {
        const { title, value, type, category } = object;
        const transaction: Transaction = await createTransaction.execute({
          title,
          value: parseInt(value, 10),
          type,
          category,
        });
        console.log(transaction);
        return transaction;
      }),
    );
    return transactions;
    // } catch (err) {
    //   return new Error('importation failed');
    // }
  }
}

export default ImportTransactionsService;
