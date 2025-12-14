import styles from "@/components/Admin/ContentLists/ContentList.module.scss";
import DocumentList from "./DocumentList";
import { Section } from "@/types/section";
import { Subsection } from "@/types/subSection";
import { Document } from "@/types/document";
import { ModalType, MoveItemFn } from "../ContentList";
import { useAppDispatch } from "@/store/hooks";
import { deleteSubsection } from "@/store/slices/subsectionsSlice";
import { fetchDocuments } from "@/store/slices/documentsSlice";
import { useEffect, useState } from "react";

interface Props {
  sub: Subsection;
  index: number;
  section: Section;
  setModal: React.Dispatch<React.SetStateAction<ModalType | null>>;
  moveItem: MoveItemFn;
  documents: Document[];
}

const SubsectionBlock: React.FC<Props> = ({ sub, index, section, setModal, moveItem, documents }) => {
  const dispatch = useAppDispatch();
  const [subDocs, setSubDocs] = useState<Document[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubDocs(documents.filter(d => d.subsectionId === sub.id));
  }, [documents, sub.id]);

  const onDelete = () => {
    if (!confirm("Удалить подраздел?")) return;
    dispatch(deleteSubsection({ subsectionId: sub.id })).then(() => {
      dispatch(fetchDocuments());
    });
  };

  return (
    <div style={{ marginLeft: "20px" }} className={styles.wrapper_section}>
      <div className={styles.title}>
        <h3>{sub.name}</h3>
        <div>
          <span className={`${styles.moveLink} ${index === 0 ? styles.disabled : ""}`} onClick={() => moveItem(section.subsections!, index, index - 1, "subsections", section.id)}>вверх</span>
          <span className={`${styles.moveLink} ${index === (section.subsections?.length ?? 1) - 1 ? styles.disabled : ""}`} onClick={() => moveItem(section.subsections!, index, index + 1, "subsections", section.id)}>вниз</span>
        </div>
      </div>

      <p>{sub.description}</p>

      <div className={styles.buttons}>
        <button onClick={() => setModal({ type: "subsection", data: sub, parentId: section.id })}>Редактировать</button>
        <button onClick={onDelete}>Удалить</button>
      </div>

      <DocumentList docs={subDocs} subsectionId={sub.id} moveItem={moveItem} />
    </div>
  );
};

export default SubsectionBlock;
