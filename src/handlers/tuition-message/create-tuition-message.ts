import { Request, Response } from 'express-serve-static-core';
import { validationResult } from 'express-validator';

import { Between } from 'typeorm';
import { AppDataSource } from '../../database/app-data-source';

import { HttpStatusCode } from '../../constants/http-status-code';
import { ErrorsMessages } from '../../constants/error-messages';

import { TuitionMessage } from '../../database/entities/TuitionMessage';
import { Tuition } from '../../database/entities/Tuition';


export async function createTuitionMessage(req: Request, res: Response<object | { error: string; details?: string }>) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
    return;
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { tuition, message, userName } = req.body;

    const tuitionEntity = await queryRunner.manager.findOne(Tuition, {
      where: { uuid: tuition },
    });
    if (!tuitionEntity) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        error: ErrorsMessages.NOT_FOUND,
        details: 'Tuition not found'
      });
      return;
    }

    // Create enrollment entity
    const tuitionMessageEntity = queryRunner.manager.create(TuitionMessage, {
      tuition: tuitionEntity,
      message,
      userName,
    });
    await queryRunner.manager.save(tuitionMessageEntity);
    await queryRunner.commitTransaction();

    res.status(HttpStatusCode.CREATED).json(tuitionMessageEntity);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: ErrorsMessages.INTERNAL_SERVER_ERROR,
      details: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  } finally {
    await queryRunner.release();
  }
}
