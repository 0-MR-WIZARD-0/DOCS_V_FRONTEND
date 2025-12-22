import { Document } from "./document";
import { ModalType, MoveItemFn } from "./modalType";
import { Section } from "./section";

export interface Subsection {
  id: number;
  name: string;
  description?: string;
  order: number;
  sectionId: number;
  documents: Document[];
}

export interface PropsSubsection {
  sub: Subsection;
  index: number;
  section: Section;
  setModal: React.Dispatch<React.SetStateAction<ModalType | null>>;
  moveItem: MoveItemFn;
  documents: Document[];
}