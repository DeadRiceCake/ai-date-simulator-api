import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722258081183 implements MigrationInterface {
    name = 'Migration1722258081183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "friends" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "gender" character varying NOT NULL, "image_url" character varying NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "user_id" integer, CONSTRAINT "PK_65e1b06a9f379ee5255054021e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_f2534e418d51fa6e5e8cdd4b480" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_f2534e418d51fa6e5e8cdd4b480"`);
        await queryRunner.query(`DROP TABLE "friends"`);
    }

}
