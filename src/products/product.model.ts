import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: false },
  tags: { type: [String], required: false },
});

export interface Product extends mongoose.Document {
  id: string;
  name: string;
  description: string;
  status: 'Draft' | 'Listed' | 'Archive';
  tags: string[];
}
