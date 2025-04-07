import { Request, Response } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import { AppDataSource } from '../../database/app-data-source';
import { HttpStatusCode } from '../../constants/http-status-code';
import { ErrorsMessages } from '../../constants/error-messages';
import { Tuition } from '../../database/entities/Tuition';

export async function updateTuition(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
    return;
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    const { uuid } = req.params;

    const tuition = await queryRunner.manager.findOne(Tuition, { where: { uuid } });
    if (!tuition) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        error: ErrorsMessages.NOT_FOUND,
        details: 'Tuition not found'
      });
      return;
    }

    const { isPaid } = req.body;

    if (typeof isPaid !== 'undefined') {
      tuition.isPaid = isPaid;
      
      if (isPaid) {
        tuition.paidAt = new Date();
      } else {
        tuition.paidAt = null;
      }
    }

    await queryRunner.manager.save(tuition);
    await queryRunner.commitTransaction();
    res.status(HttpStatusCode.OK).json(tuition);
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
