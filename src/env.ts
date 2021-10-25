import { resolve } from 'path';
import { config } from 'dotenv';
import * as envVar from 'env-var';

config({ path: resolve(__dirname, '../.env') });

const env = {
  nodeEnv: envVar.get('NODE_ENV').default('development').asString(),
  port: envVar.get('PORT').default(3001).asIntPositive(),
};

export default env;
