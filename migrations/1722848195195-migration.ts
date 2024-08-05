import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722848195195 implements MigrationInterface {
    name = 'Migration1722848195195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "friends_images" ("id" SERIAL NOT NULL, "prompt" character varying(2000) NOT NULL, "image_url" character varying NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "user_id" integer, CONSTRAINT "PK_50078e7b86ff84fc1dc32477dfc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "friends_images" ADD CONSTRAINT "FK_0c2224aa5d9f2fae6bd0fa21b5b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friends_images" DROP CONSTRAINT "FK_0c2224aa5d9f2fae6bd0fa21b5b"`);
        await queryRunner.query(`DROP TABLE "friends_images"`);
    }

}
