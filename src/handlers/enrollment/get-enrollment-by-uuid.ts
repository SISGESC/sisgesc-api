import { Request, Response } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import { AppDataSource } from '../../database/app-data-source';
import { HttpStatusCode } from '../../constants/http-status-code';
import { ErrorsMessages } from '../../constants/error-messages';
import { Enrollment } from '../../database/entities/Enrollment';

export async function getEnrollmentByUUID(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
    return;
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  
  try {
    const { uuid } = req.params;

    const enrollment = await AppDataSource.getRepository(Enrollment)
      .createQueryBuilder("enrollment")
      .leftJoinAndSelect("enrollment.classGroup", "classGroup")
      .leftJoinAndSelect("enrollment.shift", "shift")
      .leftJoinAndSelect("enrollment.tuitions", "tuition")
      .select([
        "enrollment.uuid",
        "enrollment.parentId",
        "enrollment.status",
        "enrollment.isDaycare",
        "enrollment.studentName",
        "enrollment.gender",
        "enrollment.birthday",
        "classGroup.name",
        "shift.name",
        "tuition.uuid",
        "tuition.code",
        "tuition.amount",
        "tuition.dueDate",
        "tuition.isPaid",
        "enrollment.createdAt",
        "enrollment.updatedAt",
      ])
      .where("enrollment.uuid = :uuid", { uuid })
      .getOne();

    if (!enrollment) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        error: ErrorsMessages.NOT_FOUND,
        details: 'Enrollment not found'
      });
      return;
    }
    res.status(HttpStatusCode.OK).json(enrollment);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: ErrorsMessages.INTERNAL_SERVER_ERROR,
      details: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
}