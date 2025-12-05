import { Category } from "./category";

export interface Document {
  id: number;
  title: string;
  description: string;
  category: Category;
  filename?: string;
  path?: string;
  createdAt: string;
}