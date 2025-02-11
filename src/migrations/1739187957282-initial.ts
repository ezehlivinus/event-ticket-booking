import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1739187957282 implements MigrationInterface {
    name = 'Initial1739187957282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "availableTickets" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "availableTickets"`);
    }

}
