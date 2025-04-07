import { MigrationInterface, QueryRunner } from "typeorm";

export class StartDatabase1743992773908 implements MigrationInterface {
    name = 'StartDatabase1743992773908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shifts" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "UQ_3ef662f98036997809da8338d31" UNIQUE ("name"), CONSTRAINT "PK_84d692e367e4d6cdf045828768c" PRIMARY KEY ("id")); COMMENT ON COLUMN "shifts"."name" IS 'Name of the shift (must be unique)'`);
        await queryRunner.query(`CREATE TABLE "tuition_messages" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_name" character varying(255) NOT NULL, "message" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "tuition_id" integer NOT NULL, CONSTRAINT "UQ_e507b6d61345fb6236d0715ef46" UNIQUE ("uuid"), CONSTRAINT "PK_54d5272e384adec60244b79615a" PRIMARY KEY ("id")); COMMENT ON COLUMN "tuition_messages"."message" IS 'The first message starts with a receipt url sent by the parent'`);
        await queryRunner.query(`CREATE TABLE "tuitions" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(22) NOT NULL, "due_date" date NOT NULL, "amount" character varying(20) NOT NULL, "is_enrollment" boolean NOT NULL DEFAULT false, "is_paid" boolean NOT NULL DEFAULT false, "paid_at" date, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "enrollment_id" integer NOT NULL, CONSTRAINT "UQ_59acb982ae6aa52f711b37e9751" UNIQUE ("uuid"), CONSTRAINT "UQ_fe0b02f249819adceb28e9369b6" UNIQUE ("code"), CONSTRAINT "PK_86f680e7b5ce273d601571232c0" PRIMARY KEY ("id")); COMMENT ON COLUMN "tuitions"."code" IS 'Unique code for the tuition payment'; COMMENT ON COLUMN "tuitions"."due_date" IS 'Due date for the tuition payment'; COMMENT ON COLUMN "tuitions"."amount" IS 'Amount to be paid (stored as string for precise decimal handling)'; COMMENT ON COLUMN "tuitions"."is_enrollment" IS 'Indicates if this is an enrollment fee'; COMMENT ON COLUMN "tuitions"."is_paid" IS 'Indicates if the tuition has been paid'; COMMENT ON COLUMN "tuitions"."paid_at" IS 'Date when the payment was mark as paid'`);
        await queryRunner.query(`CREATE TABLE "enrollments" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "parent_id" character varying(50) NOT NULL, "student_name" character varying(255) NOT NULL, "status" boolean NOT NULL DEFAULT true, "is_daycare" boolean NOT NULL, "birthday" date, "gender" character varying(1), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "class_id" integer NOT NULL, "shift_id" integer NOT NULL, CONSTRAINT "UQ_76b6ab0979b41b6dce22a4d9801" UNIQUE ("uuid"), CONSTRAINT "PK_7c0f752f9fb68bf6ed7367ab00f" PRIMARY KEY ("id")); COMMENT ON COLUMN "enrollments"."parent_id" IS 'User from QuotiAuth.middleware'; COMMENT ON COLUMN "enrollments"."student_name" IS 'Student name (for display purposes)'; COMMENT ON COLUMN "enrollments"."status" IS 'Indicates if the enrollment is active'; COMMENT ON COLUMN "enrollments"."is_daycare" IS 'Indicates if the enrollment includes daycare'; COMMENT ON COLUMN "enrollments"."birthday" IS 'Birthday of the student'; COMMENT ON COLUMN "enrollments"."gender" IS 'Gender of the student (Male or Female)'`);
        await queryRunner.query(`CREATE TABLE "classes" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "UQ_1f3940af28a76098f31004f03ca" UNIQUE ("name"), CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY ("id")); COMMENT ON COLUMN "classes"."name" IS 'Name of the grade (must be unique)'`);
        await queryRunner.query(`ALTER TABLE "tuition_messages" ADD CONSTRAINT "FK_3c8d6f2d31dcd84a90f375a3f46" FOREIGN KEY ("tuition_id") REFERENCES "tuitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tuitions" ADD CONSTRAINT "FK_9ea92f6000c0af78855d2e42a0d" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_f8b7b5b30f3d3c3c8b81068cd79" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_ee417e6085b4420d62c7c7e728e" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_ee417e6085b4420d62c7c7e728e"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_f8b7b5b30f3d3c3c8b81068cd79"`);
        await queryRunner.query(`ALTER TABLE "tuitions" DROP CONSTRAINT "FK_9ea92f6000c0af78855d2e42a0d"`);
        await queryRunner.query(`ALTER TABLE "tuition_messages" DROP CONSTRAINT "FK_3c8d6f2d31dcd84a90f375a3f46"`);
        await queryRunner.query(`DROP TABLE "classes"`);
        await queryRunner.query(`DROP TABLE "enrollments"`);
        await queryRunner.query(`DROP TABLE "tuitions"`);
        await queryRunner.query(`DROP TABLE "tuition_messages"`);
        await queryRunner.query(`DROP TABLE "shifts"`);
    }

}
