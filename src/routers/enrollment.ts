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

/**
 * @swagger
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       required:
 *         - parent
 *         - classGroup
 *         - shift
 *         - isDaycare
 *         - student
 *         - billing
 *       properties:
 *         parent:
 *           type: string
 *           description: Parent ID
 *         classGroup:
 *           type: integer
 *           minimum: 1
 *           description: Class group ID
 *         shift:
 *           type: integer
 *           minimum: 1
 *           description: Shift ID
 *         isDaycare:
 *           type: boolean
 *           description: Whether the enrollment is for daycare
 *         student:
 *           type: object
 *           required:
 *             - name
 *             - gender
 *             - birthday
 *           properties:
 *             name:
 *               type: string
 *               description: Student's full name
 *             gender:
 *               type: string
 *               enum: [M, F]
 *               description: Student's gender
 *             birthday:
 *               type: string
 *               format: date
 *               description: Student's birthday
 *         billing:
 *           type: object
 *           required:
 *             - fees
 *             - dueDay
 *           properties:
 *             fees:
 *               type: object
 *               required:
 *                 - initial
 *                 - recurring
 *               properties:
 *                 initial:
 *                   type: number
 *                   format: float
 *                   description: Initial enrollment fee
 *                 recurring:
 *                   type: number
 *                   format: float
 *                   description: Recurring monthly fee
 *             dueDay:
 *               type: integer
 *               minimum: 1
 *               maximum: 28
 *               description: Day of the month when payment is due
 */

/**
 * @swagger
 * /v1/enrollments:
 *   post:
 *     summary: Create a new enrollment
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Enrollment'
 *     responses:
 *       201:
 *         description: Enrollment created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /v1/enrollments:
 *   get:
 *     summary: List all enrollments
 *     tags: [Enrollments]
 *     responses:
 *       200:
 *         description: List of enrollments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 *       401:
 *         description: Unauthorized
 */
v1.get(
  '/',
  checkExact([], { message: 'Only the specified fields are allowed' }),
  listEnrollments,
);

/**
 * @swagger
 * /v1/enrollments/{uuid}:
 *   get:
 *     summary: Get enrollment by UUID
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Enrollment UUID
 *     responses:
 *       200:
 *         description: Enrollment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       404:
 *         description: Enrollment not found
 *       401:
 *         description: Unauthorized
 */
v1.get(
  '/:uuid',
  param('uuid').isUUID().withMessage('UUID must be a valid UUID'),
  checkExact([], { message: 'Only the specified fields are allowed' }),
  getEnrollmentByUUID,
);

/**
 * @swagger
 * /v1/enrollments/{uuid}:
 *   put:
 *     summary: Update an enrollment
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Enrollment UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classGroup:
 *                 type: integer
 *                 minimum: 1
 *               shift:
 *                 type: integer
 *                 minimum: 1
 *               isDaycare:
 *                 type: boolean
 *               status:
 *                 type: boolean
 *               studentName:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [M, F]
 *     responses:
 *       200:
 *         description: Enrollment updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Enrollment not found
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /v1/enrollments/{uuid}:
 *   delete:
 *     summary: Delete an enrollment
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Enrollment UUID
 *     responses:
 *       204:
 *         description: Enrollment deleted successfully
 *       404:
 *         description: Enrollment not found
 *       401:
 *         description: Unauthorized
 */
v1.delete(
  '/:uuid',
  param('uuid').isUUID().withMessage('UUID must be a valid UUID'),
  checkExact([], { message: 'Only the specified fields are allowed' }),
  deleteEnrollment,
);

enrollmentRouter.use('/v1/enrollments', v1);
export default enrollmentRouter;
