import { Document, Schema } from 'mongoose';
import { Genders } from '../../../constants';

export interface Sale extends Document {
  userName: string;
  age: number;
  height: number;
  gender: string;
  saleAmount: number;
  lastPurchaseDate: Date;
}

export const saleSchema = new Schema<Sale>({
  userName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  height: {
    type: Number,
    required: true,
    min: 0,
    max: 300,
  },
  gender: {
    type: String,
    required: true,
    enum: Object.values(Genders),
  },
  saleAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  lastPurchaseDate: {
    type: Date,
    required: true,
  },
});

export default saleSchema;
