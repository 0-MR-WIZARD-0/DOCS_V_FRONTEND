export interface Document {
  id: number;
  title: string;
  description: string;
  filename?: string;
  order: number;
  path: string;
  createdAt: string;
  sectionId?: number | null;
  subsectionId?: number | null;
}