import { Document } from "./document";
import { Subsection } from "./subSection";

export interface Section {
  id: number;
  name: string;
  description?: string;
  order: number;
  subsections?: Subsection[];
  documents: Document[];
}