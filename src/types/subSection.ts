import { Document } from "./document";

export interface Subsection {
  sectionId: number;
  id: number;
  name: string;
  description?: string;
  order: number;
  documents: Document[];
}