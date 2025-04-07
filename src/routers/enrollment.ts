import { Router } from 'express';
import { body, checkExact, param } from 'express-validator';
import { isValidDate } from '../utils/date-validation';

import { createEnrollment } from '../handlers/enrollment/create-enrollment';
import { listEnrollments } from '../handlers/enrollment/list-enrollments';
import { getEnrollmentByUUID } from '../handlers/enrollment/get-enrollment-by-uuid';
import { updateEnrollment } from '../handlers/enrollment/update-enrollment';
import { deleteEnrollment } from '../handlers/enrollment/delete-enrollment';

const enrollmentRouter = Router();
const v1 = Router();

v1.post(
  '/',

  // Enrollment validations
  body('parent').isString().withMessage('Parent ID must be a string').notEmpty().withMessage('Parent ID is required'),
  body('classGroup').isInt({ min: 1 }).withMessage('class ID must be a positive integer'),
  body('shift').isInt({ min: 1 }).withMessage('Shift ID must be a positive integer'),
  body('isDaycare').isBoolean().withMessage('isDaycare must be a boolean'),
  // Student validations
  body('student.name').isString().withMessage('Student name must be a string').notEmpty().withMessage('Student name is required'),
  body('student.gender').isString().withMessage('Student gender must be a string').isIn(['M', 'F']).withMessage('Student gender must be "M" or "F"'),
  body('student.birthday').custom(isValidDate).withMessage('Student birthday must be a valid date'),
  // Billing validations
  body('billing.fees.initial').isCurrency().withMessage('Initial fee must be a valid currency amount'),
  body('billing.fees.recurring').isCurrency().withMessage('Recurring fee must be a valid currency amount'),
  body('billing.dueDay').isInt({min: 1, max: 28}).withMessage('Due date must be between 1 and 28'),

  checkExact([], { message: 'Only the specified fields are allowed' }),
  createEnrollment
);

v1.get(
  '/',
  checkExact([], { message: 'Only the specified fields are allowed' }),
  listEnrollments,
);

v1.get(
  '/:uuid',
  param('uuid').isUUID().withMessage('UUID must be a valid UUID'),
  checkExact([], { message: 'Only the specified fields are allowed' }),
  getEnrollmentByUUID,
);


v1.put(
  '/:uuid',
  param('uuid').isUUID().withMessage('UUID must be a valid UUID'),

  body('classGroup').optional().isInt({ min: 1 }).withMessage('Class ID must be a positive integer'),
  body('shift').optional().isInt({ min: 1 }).withMessage('Shift ID must be a positive integer'),
  body('isDaycare').optional().isBoolean().withMessage('isDaycare must be a boolean'),
  body('status').optional().isBoolean().withMessage('Status must be a boolean'),
  body('studentName').optional().isString().withMessage('Student name must be a string').notEmpty().withMessage('Student name is required'),
  body('birthday').optional().custom(isValidDate).withMessage('Student birthday must be a valid date'),
  body('gender').optional().isString().withMessage('Student gender must be a string').isIn(['M', 'F']).withMessage('Student gender must be "M" or "F"'),

  checkExact([], { message: 'Only the specified fields are allowed' }),
  updateEnrollment,
);

v1.delete(
  '/:uuid',
  param('uuid').isUUID().withMessage('UUID must be a valid UUID'),
  checkExact([], { message: 'Only the specified fields are allowed' }),
  deleteEnrollment,
);

enrollmentRouter.use('/v1/enrollments', v1);
export default enrollmentRouter;
