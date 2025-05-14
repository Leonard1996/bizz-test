import {MigrationInterface, QueryRunner} from "typeorm";

export class init1747080007766 implements MigrationInterface {
    name = 'init1747080007766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`trips\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` bigint NOT NULL, \`updatedAt\` bigint NOT NULL, \`origin\` varchar(3) NOT NULL, \`destination\` varchar(3) NOT NULL, \`cost\` decimal NOT NULL, \`duration\` int NOT NULL, \`type\` varchar(255) NOT NULL, \`displayName\` varchar(255) NOT NULL, \`originalId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`trips\``);
    }

}
