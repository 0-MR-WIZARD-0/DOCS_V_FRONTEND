import styles from "@/components/Admin/ContentLists/ContentList.module.scss";
import DocumentList from "./DocumentList";
import { PropsSubsection } from "@/types/subSection";
import { useAppDispatch } from "@/store/hooks";
import { deleteSubsection } from "@/store/slices/subsectionsSlice";
import { useMemo } from "react";
import { fetchSections } from "@/store/slices/sectionsSlice";

const SubsectionBlock: React.FC<PropsSubsection> = ({ sub, index, section, setModal, moveItem, documents }) => {
  const dispatch = useAppDispatch();

  const subDocs = useMemo(
    () => documents.filter(d => d.subsectionId === sub.id),
    [documents, sub.id]
  );

  const onDelete = () => {
    if (!confirm("Удалить подраздел?")) return;
    dispatch(deleteSubsection(sub.id)).then(() => {
      dispatch(fetchSections())
    });
  };

  const moveUp = () => moveItem(section.subsections!, sub.id, "subsections", "up", sub.order)
  const moveDown = () => moveItem(section.subsections!, sub.id, "subsections", "down", sub.order)

  return (
    <div className={styles.wrapper_section} style={{ paddingLeft: "10px" }}>
      <div className={styles.title}>
        <h4>{sub.name}</h4>
        <div>
          <span className={`${styles.moveLink} ${index === 0 ? styles.disabled : ""}`} onClick={moveUp}>вверх</span>
          <span className={`${styles.moveLink} ${index === (section.subsections?.length ?? 1) - 1 ? styles.disabled : ""}`} onClick={moveDown}>вниз</span>
        </div>
      </div>
      {(sub.description ? <p>{sub.description}</p> : "")}
      <div className={styles.buttons}>
        <button onClick={() => setModal({ type: "subsection", data: sub, parentId: section.id })}>Редактировать</button>
        <button onClick={onDelete}>Удалить</button>
      </div>
      <DocumentList docs={subDocs} subsectionId={sub.id} moveItem={moveItem} />
    </div>
  );
};

export default SubsectionBlock;