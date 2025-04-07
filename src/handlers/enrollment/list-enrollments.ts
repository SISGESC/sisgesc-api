import { Request, Response } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import { AppDataSource } from '../../database/app-data-source';
import { HttpStatusCode } from '../../constants/http-status-code';
import { ErrorsMessages } from '../../constants/error-messages';
import { Enrollment } from '../../database/entities/Enrollment';
import { IsNull } from 'typeorm';

export async function listEnrollments(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
    return;
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    const enrollments = await AppDataSource.getRepository(Enrollment).find({
      relations: ['classGroup', 'shift'],
      where: {
        deletedAt: IsNull()
      },
      select: {
        uuid: true,
        parentId: true,
        status: true,
        isDaycare: true,
        studentName: true,
        birthday: true,
        gender: true,
        classGroup: {
          name: true
        },
        shift: {
          name: true
        },
        createdAt: true,
        updatedAt: true
      }
    });
    res.status(HttpStatusCode.OK).json(enrollments);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: ErrorsMessages.INTERNAL_SERVER_ERROR,
      details: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  } finally {
    await queryRunner.release();
  }
}