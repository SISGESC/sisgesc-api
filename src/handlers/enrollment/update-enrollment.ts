import { Request, Response } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import { AppDataSource } from '../../database/app-data-source';
import { HttpStatusCode } from '../../constants/http-status-code';
import { ErrorsMessages } from '../../constants/error-messages';
import { Enrollment } from '../../database/entities/Enrollment';
import { ClassGroup } from '../../database/entities/ClassGroup';
import { Shift } from '../../database/entities/Shift';

export async function updateEnrollment(req: Request, res: Response) {
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

    const enrollment = await queryRunner.manager.findOne(Enrollment, { where: { uuid } });
    if (!enrollment) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        error: ErrorsMessages.NOT_FOUND,
        details: 'Enrollment not found'
      });
      return;
    }

    const { classGroup, shift, isDaycare, status, studentName, birthday, gender } = req.body;

    if (classGroup) {
      const classGroupEntity = await queryRunner.manager.findOne(ClassGroup, { where: { id: classGroup } });
      if (!classGroupEntity) {
        res.status(HttpStatusCode.NOT_FOUND).json({
          error: ErrorsMessages.NOT_FOUND,
          details: 'Class group not found'
        });
        return;
      }
      enrollment.classGroup = classGroupEntity;
    }

    if (shift) {
      const shiftEntity = await queryRunner.manager.findOne(Shift, { where: { id: shift } });
      if (!shiftEntity) {
        res.status(HttpStatusCode.NOT_FOUND).json({
          error: ErrorsMessages.NOT_FOUND,
          details: 'Shift not found'
        });
        return;
      }
      enrollment.shift = shiftEntity;
    }

    if (typeof isDaycare !== 'undefined') {
      enrollment.isDaycare = isDaycare;
    }

    if (typeof status !== 'undefined') {
      enrollment.status = status;
    }

    if (studentName) {
      enrollment.studentName = studentName;
    }

    if (birthday) {
      enrollment.birthday = birthday;
    }

    if (gender) {
      enrollment.gender = gender;
    }

    await queryRunner.manager.save(enrollment);
    await queryRunner.commitTransaction();
    res.status(HttpStatusCode.OK).json(enrollment);
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
