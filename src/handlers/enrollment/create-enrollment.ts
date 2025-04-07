import { Request, Response } from 'express-serve-static-core';
import { validationResult } from 'express-validator';

import { Between } from 'typeorm';
import { AppDataSource } from '../../database/app-data-source';

import { HttpStatusCode } from '../../constants/http-status-code';
import { ErrorsMessages } from '../../constants/error-messages';

import { ClassGroup } from '../../database/entities/ClassGroup';
import { Shift } from '../../database/entities/Shift';
import { Enrollment } from '../../database/entities/Enrollment';
import { Tuition } from '../../database/entities/Tuition';


export async function createEnrollment(req: Request, res: Response<object | { error: string; details?: string }>) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
    return;
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { parent, classGroup, shift, isDaycare, student, billing } = req.body;

    // Fetch class group entity
    const classGroupEntity = await queryRunner.manager.findOne(ClassGroup, { where: { id: classGroup } });
    if (!classGroupEntity) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        error: ErrorsMessages.NOT_FOUND,
        details: 'Class group not found'
      });
      return;
    }

    // Fetch shift entity
    const shiftEntity = await queryRunner.manager.findOne(Shift, {  where: { id: shift } });
    if (!shiftEntity) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        error: ErrorsMessages.NOT_FOUND,
        details: 'Shift not found'
      });
      return;
    }

    // Check existing enrollments for this guardian in the current year
    const currentYear = new Date().getFullYear();
    const enrollmentsThisYear = await queryRunner.manager.find(Enrollment, {
      where: {
        parentId: parent,
        createdAt: Between(new Date(`${currentYear}-01-01`), new Date(`${currentYear + 1}-01-01`))
      },
    });

    // Check if the student is already enrolled this year
    const isStudentAlreadyEnrolled = enrollmentsThisYear.some(enrollment =>
      enrollment.studentName === student.name,
    );

    if (isStudentAlreadyEnrolled) {
      res.status(HttpStatusCode.CONFLICT).json({
        error: ErrorsMessages.CONFLICT,
        details: 'Student is already enrolled this year'
      });
      return;
    }

    // Create enrollment entity
    const enrollmentEntity = queryRunner.manager.create(Enrollment, {
      classGroup: classGroupEntity,
      shift: shiftEntity,
      isDaycare: isDaycare,
      birthday: student.birthday,
      gender: student.gender,
      parentId: parent,
      studentName: student.name,
    });
    await queryRunner.manager.save(enrollmentEntity);

    // Create tuition payments (12 installments)
    const tuitions: Tuition[] = [];

    const currentDate = new Date();
    currentDate.setMonth(0); // January
    currentDate.setDate(billing.dueDay);
    currentDate.setHours(0, 0, 0, 0);

    // First tuition (initial fee)
    tuitions.push(
      queryRunner.manager.create(Tuition, {
        code: generateRandomDigits(22),
        isPaid: false,
        isEnrollment: true,
        amount: billing.fees.initial,
        enrollment: enrollmentEntity,
        dueDate: currentDate.toISOString(),
      })
    );

    // Remaining 11 monthly payments
    for (let i = 1; i <= 11; i++) {
      const dueDate = new Date();
      dueDate.setMonth(currentDate.getMonth() + i);
      dueDate.setDate(billing.dueDay);
      dueDate.setHours(0, 0, 0, 0);

      tuitions.push(
        queryRunner.manager.create(Tuition, {
          code: generateRandomDigits(22),
          isPaid: false,
          isEnrollment: false,
          amount: billing.fees.recurring,
          enrollment: enrollmentEntity,
          dueDate: dueDate.toISOString(),
        })
      );
    }

    await queryRunner.manager.save(tuitions);
    await queryRunner.commitTransaction();

    res.status(HttpStatusCode.CREATED).json({
      uuid: enrollmentEntity.uuid,
      parent,
      classGroup,
      shift,
      isDaycare,
      student: {
        name: student.name,
        gender: student.gender,
        birthday: student.birthday,
      },
      tuitions: tuitions.map(tuition => ({
        code: tuition.code,
        amount: tuition.amount,
        dueDate: tuition.dueDate,
        isPaid: tuition.isPaid,
      })),
    });
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

const generateRandomDigits = (length: number) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
};
