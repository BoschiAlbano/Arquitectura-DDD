import { MigrationInterface, QueryRunner } from "typeorm";

export class Inicial1740088552237 implements MigrationInterface {
    name = 'Inicial1740088552237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`agenda\` (\`id\` int NOT NULL AUTO_INCREMENT, \`Nombre\` varchar(255) NOT NULL, \`Apellido\` varchar(255) NOT NULL, \`Telefono\` varchar(255) NOT NULL, \`Direccion\` varchar(255) NOT NULL, \`Email\` varchar(255) NOT NULL, \`Nota\` varchar(255) NOT NULL, \`usuarioId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuario\` (\`id\` int NOT NULL AUTO_INCREMENT, \`Nombre\` varchar(255) NOT NULL, \`Apellido\` varchar(255) NOT NULL, \`Dni\` varchar(255) NOT NULL, \`Email\` varchar(255) NOT NULL, \`Password\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`agenda\` ADD CONSTRAINT \`FK_932638af43ef28915e0eae58a95\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`agenda\` DROP FOREIGN KEY \`FK_932638af43ef28915e0eae58a95\``);
        await queryRunner.query(`DROP TABLE \`usuario\``);
        await queryRunner.query(`DROP TABLE \`agenda\``);
    }

}
