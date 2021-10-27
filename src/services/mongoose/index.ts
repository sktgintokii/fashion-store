import mongoose from 'mongoose';
import env from '../../env';
import saleSchema from './schemas/Sale';

mongoose.connect(env.mongo.uri);

const models = {
  Sale: mongoose.model('Sale', saleSchema),
};

export default mongoose;
export { models };
