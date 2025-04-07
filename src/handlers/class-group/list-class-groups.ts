import { Request, Response } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import { AppDataSource } from '../../database/app-data-source';
import { HttpStatusCode } from '../../constants/http-status-code';
import { ErrorsMessages } from '../../constants/error-messages';
import { ClassGroup } from '../../database/entities/ClassGroup';


export async function listClassGroups(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
    return;
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    const classGroups = await AppDataSource.getRepository(ClassGroup).find({
      select: {
        id: true,
        name: true,
      }
    });
    res.status(HttpStatusCode.OK).json(classGroups);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: ErrorsMessages.INTERNAL_SERVER_ERROR,
      details: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  } finally {
    await queryRunner.release();
  }
}