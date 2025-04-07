import { Request, Response } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import { AppDataSource } from '../../database/app-data-source';
import { HttpStatusCode } from '../../constants/http-status-code';
import { ErrorsMessages } from '../../constants/error-messages';
import { Tuition } from '../../database/entities/Tuition';

export async function getTuitionByUUID(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
    return;
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  
  try {
    const { uuid } = req.params;

    const tuition = await AppDataSource.getRepository(Tuition)
      .createQueryBuilder("tuition")
      .leftJoinAndSelect("tuition.enrollment", "enrollment")
      .leftJoinAndSelect("tuition.messages", "tuitionMessages")
      .select([
        "tuition.uuid",
        "tuition.amount",
        "tuition.dueDate",
        "tuition.isPaid",
        "enrollment.uuid",
        "enrollment.studentName",
        "enrollment.classGroup",
        "enrollment.shift",
        "enrollment.createdAt",
        "enrollment.updatedAt",
        "tuitionMessages.uuid",
        "tuitionMessages.message",
        "tuitionMessages.createdAt"
      ])
      .where("tuition.uuid = :uuid", { uuid })
      .andWhere("tuition.deletedAt IS NULL")
      .andWhere("enrollment.deletedAt IS NULL")
      .andWhere("tuitionMessages.deletedAt IS NULL")
      .orderBy("tuitionMessages.createdAt", "ASC")
      .getOne();


    if (!tuition) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        error: ErrorsMessages.NOT_FOUND,
        details: 'Tuition not found'
      });
      return;
    }
    res.status(HttpStatusCode.OK).json(tuition);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: ErrorsMessages.INTERNAL_SERVER_ERROR,
      details: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
}