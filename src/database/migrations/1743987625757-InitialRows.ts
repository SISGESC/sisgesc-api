import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialRows1743987625757 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          INSERT INTO shifts (name) VALUES
            ('Manhã'),
            ('Tarde');
        `);
        await queryRunner.query(`
          INSERT INTO classes (name) VALUES
            ('Infantil 3'),
            ('Infantil 4'),
            ('Infantil 5'),
            ('1º Ano'),
            ('2º Ano'),
            ('3º Ano'),
            ('4º Ano'),
            ('5º Ano');
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          DELETE FROM shifts WHERE name IN ('Manhã', 'Tarde');
        `);
        await queryRunner.query(`
          DELETE FROM classes WHERE name IN (
            'Infantil 3',
            'Infantil 4',
            'Infantil 5',
            '1º Ano',
            '2º Ano',
            '3º Ano',
            '4º Ano',
            '5º Ano'
          );
        `);
      }

}
