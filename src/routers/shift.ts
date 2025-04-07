import { Router } from 'express';
import { checkExact } from 'express-validator';
import { listShifts } from '../handlers/shift/list-shifts';

const shiftRouter = Router();
const v1 = Router();

v1.get(
  '/',
  checkExact([], { message: 'Only the specified fields are allowed' }),
  listShifts,
);

shiftRouter.use('/v1/shifts', v1);
export default shiftRouter;
