import { MoveItemFn } from "./modalType";

export interface Document {
  id: number;
  title: string;
  description: string;
  filename?: string;
  order: number;
  path: string;
  sectionId?: number | null;
  subsectionId?: number | null;
}

export interface PropsDocumentList {
  docs: Document[];
  sectionId?: number;
  subsectionId?: number;
  moveItem: MoveItemFn;
}

export interface PropsDocument {
  doc: Document;
  index: number;
  docs: Document[];
  moveItem: MoveItemFn;
  sectionId?: number;
  subsectionId?: number;
}