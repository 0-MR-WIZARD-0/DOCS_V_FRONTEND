import styles from "@/components/Admin/ContentLists/ContentList.module.scss";
import DocumentList from "./DocumentList";
import SubsectionBlock from "./SubsectionBlock";
import { Section } from "@/types/section";
import { Subsection } from "@/types/subSection";
import { Document } from "@/types/document";
import { ModalType, MoveItemFn } from "../ContentList";
import { useAppDispatch } from "@/store/hooks";
import { deleteSection, fetchSections } from "@/store/slices/sectionsSlice";
import { useMemo } from "react";

interface Props {
  section: Section;
  index: number;
  sections: Section[];
  setModal: React.Dispatch<React.SetStateAction<ModalType | null>>;
  documents: Document[];
  subsections: Subsection[];
  isLoading: boolean;
  moveItem: MoveItemFn;
}

const SectionBlock: React.FC<Props> = ({ section, index, sections, setModal, documents, moveItem }) => {
  const dispatch = useAppDispatch();

  const sectionDocs = useMemo(
    () => documents.filter(d => d.sectionId === section.id && !d.subsectionId),
    [documents, section.id]
  );

  const sortedSubsections = useMemo(
    () =>
      [...(section.subsections ?? [])].sort(
        (a, b) => a.order - b.order
      ),
    [section.subsections]
  );

  const onDelete = () => {
    if (!confirm("Удалить раздел?")) return;
    dispatch(deleteSection(section.id)).then(() => {
      dispatch(fetchSections());
    });
  };

  const moveUp = () => moveItem(sections, section.id, "sections", "up");
  const moveDown = () => moveItem(sections, section.id, "sections", "down");

  return (
    <div>
      <div className={styles.wrapper_section}>
        <div className={styles.title}>
          <h2>{section.name}</h2>
          <div>
            <span className={`${styles.moveLink} ${index === 0 ? styles.disabled : ""}`} onClick={moveUp}>вверх</span>
            <span className={`${styles.moveLink} ${index === sections.length - 1 ? styles.disabled : ""}`} onClick={moveDown}>вниз</span>
          </div>
        </div>
        {(section.description ? <p>{section.description}</p> : "")}
        <div className={styles.buttons}>
          <button onClick={() => setModal({ type: "section", data: section })}>Редактировать</button>
          <button onClick={onDelete}>Удалить</button>
        </div>
      </div>

      <DocumentList docs={sectionDocs} sectionId={section.id} moveItem={moveItem} />

      {sortedSubsections
        .map((sub, j) => (
          <SubsectionBlock
            key={sub.id}
            sub={sub}
            index={j}
            section={section}
            setModal={setModal}
            moveItem={moveItem}
            documents={documents}
          />
        ))}
    </div>
  );
};

export default SectionBlock;