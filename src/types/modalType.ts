import { Document } from "./document";
import { Section } from "./section";
import { Subsection } from "./subSection";

export type ModalType =
  | { type: "section"; data: Section }
  | { type: "subsection"; data: Subsection; parentId: number }
  | { type: "document"; data: Document };

export type Item = Section | Subsection | Document;

export interface EditItemModalProps<T extends Item> {
  type: "section" | "subsection" | "document";
  data: T;
  parentId?: number;
  onClose: () => void;
  onUpdated: (updatedItem: T | undefined) => void;
}

export type MoveItemFn = (
  allItems: Document[] | Section[] | Subsection[],
  itemId: number,
  type: "sections" | "subsections" | "documents",
  direction: "up" | "down",
  order?: number 
) => Promise<void>;