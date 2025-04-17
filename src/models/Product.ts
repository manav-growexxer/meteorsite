// src/models/Product.ts

import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Define the interface
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  features: string[];
  capacity: number;
  material: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Use the interface in your schema
const productSchema: Schema<IProduct> = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a product name"],
    trim: true,
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a product description"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a product price"],
    min: [0, "Price cannot be negative"],
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  stock: {
    type: Number,
    required: [true, "Please provide stock quantity"],
    min: [0, "Stock cannot be negative"],
  },
  features: [
    {
      type: String,
    },
  ],
  capacity: {
    type: Number,
    required: [true, "Please provide bottle capacity"],
  },
  material: {
    type: String,
    required: [true, "Please provide bottle material"],
  },
  color: {
    type: String,
    required: [true, "Please provide bottle color"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// 3. Type the model properly
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
