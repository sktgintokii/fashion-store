import { resolve } from 'path';
import { config } from 'dotenv';
import * as envVar from 'env-var';

config({ path: resolve(__dirname, '../.env') });

const env = {
  nodeEnv: envVar.get('NODE_ENV').default('development').asString(),
  port: envVar.get('PORT').default(3001).asIntPositive(),
  mongo: {
    uri: envVar
      .get('MONGO_URI')
      .default('mongodb://localhost:27017/fashion-store')
      .asString(),
    maxBatchSize: envVar.get('MONGO_MAX_BATCH_SIZE').default(1000).asInt(),
    maxPageSize: envVar.get('MONGO_MAX_PAGE_SIZE').default(100).asInt(),
  },
};

export default env;
