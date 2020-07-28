import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableColumn,
} from 'typeorm';

export default class ForignKeyCreation1595895957647
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('cotegories', 'categories');
    await queryRunner.dropColumn('transactions', 'category_id');
    // await queryRunner.addColumn(
    //   'transactions',
    //   new TableColumn({
    //     name: 'category',
    //     type: 'varchar',
    //   }),
    // );
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'category_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'TransactionCategory',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transactions', 'TransactionCategory');
    await queryRunner.dropColumn('transactions', 'category_id');
    // await queryRunner.dropColumn('transactions', 'category');
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'category_id',
        type: 'varchar',
      }),
    );
    await queryRunner.renameTable('categories', 'cotegories');
  }
}
