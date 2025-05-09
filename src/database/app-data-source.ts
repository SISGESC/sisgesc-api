import 'dotenv/config';
import { DataSource } from 'typeorm';
import { ClassGroup } from './entities/ClassGroup';
import { Shift } from './entities/Shift';
import { Enrollment } from './entities/Enrollment';
import { Tuition } from './entities/Tuition';
import { TuitionMessage } from './entities/TuitionMessage';

import { StartDatabase1743992773908 } from './migrations/1743992773908-StartDatabase';
import { InitialRows1743992818313 } from './migrations/1743992818313-InitialRows';

export const AppDataSource = new DataSource({
  type: 'postgres',
  port: Number(process.env.TYPEORM_PORT),
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [
    ClassGroup,
    Shift,
    Enrollment,
    Tuition,
    TuitionMessage,
  ],
  migrations: [
    StartDatabase1743992773908,
    InitialRows1743992818313,
  ],
  logging: false,
  synchronize: false,
});
