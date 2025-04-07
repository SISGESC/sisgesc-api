import { Router } from 'express';
import { body, checkExact, param } from 'express-validator';
import { getTuitionByBarcode } from '../handlers/tuition/get-tuition-by-barcode';
import { updateTuition } from '../handlers/tuition/update-tuition';
import { createTuitionMessage } from '../handlers/tuition-message/create-tuition-message';
import { deleteTuitionMessage } from '../handlers/tuition-message/delete-tuition-message';
import { getTuitionByUUID } from '../handlers/tuition/get-tuition-by-uuid';

const tuitionRouter = Router();
const v1 = Router();

v1.get(
  '/:uuid',
  param('uuid').isUUID().withMessage('UUID must be a valid UUID'),
  checkExact([], { message: 'Only the specified fields are allowed' }),
  getTuitionByUUID,
);

v1.get(
  '/barcode/:barcode',
  param('barcode').isString().withMessage('Barcode must be a string').notEmpty().withMessage('Barcode is required'),
  checkExact([], { message: 'Only the specified fields are allowed' }),
  getTuitionByBarcode,
)

v1.put(
  '/:uuid',
  param('uuid').isUUID().withMessage('UUID must be a valid UUID'),
  body('isPaid').optional().isBoolean().withMessage('isPaid must be a boolean'),

  checkExact([], { message: 'Only the specified fields are allowed' }),
  updateTuition,
);

v1.post(
  '/messages',

  body('tuition').isUUID().withMessage('Tuition ID must be a valid UUID'),
  body('userName').isString().withMessage('User name must be a string').notEmpty().withMessage('User name is required'),
  body('message').isString().withMessage('Message must be a string').notEmpty().withMessage('Message is required'),

  checkExact([], { message: 'Only the specified fields are allowed' }),
  createTuitionMessage
);

v1.delete(
  '/messages/:uuid',
  param('uuid').isUUID().withMessage('UUID must be a valid UUID'),
  checkExact([], { message: 'Only the specified fields are allowed' }),
  deleteTuitionMessage,
);

tuitionRouter.use('/v1/tuitions', v1);
export default tuitionRouter;
