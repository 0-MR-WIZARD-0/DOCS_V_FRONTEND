import { Document } from "./document";
import { ModalType, MoveItemFn } from "./modalType";
import { Subsection } from "./subSection";

export interface Section {
  id: number;
  name: string;
  description?: string;
  order: number;
  subsections?: Subsection[];
  documents: Document[];
}

export interface PropsSection {
  section: Section;
  index: number;
  sections: Section[];
  setModal: React.Dispatch<React.SetStateAction<ModalType | null>>;
  documents: Document[];
  subsections: Subsection[];
  isLoading: boolean;
  moveItem: MoveItemFn;
}