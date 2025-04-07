import { Router } from 'express';
import { checkExact } from 'express-validator';
import { listClassGroups } from '../handlers/class-group/list-class-groups';

const classGroupRouter = Router();
const v1 = Router();

v1.get(
  '/',
  checkExact([], { message: 'Only the specified fields are allowed' }),
  listClassGroups,
);

classGroupRouter.use('/v1/classes', v1);
export default classGroupRouter;
