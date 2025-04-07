import { Request, Response } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import { AppDataSource } from '../../database/app-data-source';
import { HttpStatusCode } from '../../constants/http-status-code';
import { ErrorsMessages } from '../../constants/error-messages';
import { TuitionMessage } from '../../database/entities/TuitionMessage';

export async function deleteTuitionMessage(req: Request, res: Response) {
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
    const tuitionMessage = await queryRunner.manager.findOne(TuitionMessage, { where: { uuid } });
    if (!tuitionMessage) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        error: ErrorsMessages.NOT_FOUND,
        details: 'Enrollment not found'
      });
      return;
    }

    await queryRunner.manager.softRemove(tuitionMessage);
    await queryRunner.commitTransaction();
    res.status(HttpStatusCode.OK).json({ message: 'TuitionMessage deleted successfully' });
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
