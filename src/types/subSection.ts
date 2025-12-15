import { Document } from "./document";

export interface Subsection {
  id: number;
  name: string;
  description?: string;
  order: number;
  sectionId: number;
  documents: Document[];
}