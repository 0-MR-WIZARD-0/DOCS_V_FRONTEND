import { useState } from "react";
import styles from "@/components/Admin/ContentLists/ContentList.module.scss";
import { Document } from "@/types/document";
import EditItemModal from "../../EditSectionModal/EditSectionModal";
import { MoveItemFn } from "../ContentList";
import { useAppDispatch } from "@/store/hooks";
import { deleteDocument } from "@/store/slices/documentsSlice";

interface Props {
  doc: Document;
  index: number;
  docs: Document[];
  moveItem: MoveItemFn;
  sectionId?: number;
  subsectionId?: number;
}

const DocumentItemComponent: React.FC<Props> = ({
  doc,
  docs,
  index,
  moveItem,
  sectionId,
  subsectionId,
}) => {

  const [modal, setModal] = useState(false);
  const dispatch = useAppDispatch();

  const parentId = subsectionId ?? sectionId;

  const moveUp = () => moveItem(docs, index, index - 1, "documents", parentId);
  const moveDown = () => moveItem(docs, index, index + 1, "documents", parentId);

  const onDelete = () => {
    if (!confirm("Удалить документ навсегда?")) return;
    dispatch(deleteDocument(doc.id));
  };

  return (
    <div style={{ marginLeft: "40px" }} className={styles.wrapper_section}>
      <div className={styles.title}>
        <div>
          <p>
            <a href={doc.path ? `${process.env.NEXT_PUBLIC_API_URL}/${doc.path}` : undefined}>
              Документ: {doc.title}
            </a>
          </p>

          <span
            className={`${styles.moveLink} ${index === 0 ? styles.disabled : ""}`}
            onClick={index === 0 ? undefined : moveUp}
          >
            вверх
          </span>

          <span
            className={`${styles.moveLink} ${index === docs.length - 1 ? styles.disabled : ""}`}
            onClick={index === docs.length - 1 ? undefined : moveDown}
          >
            вниз
          </span>
        </div>

        <p>Опубликовано: {new Date(doc.createdAt).toLocaleDateString()}</p>
      </div>

      <p>{doc.description}</p>

      <div className={styles.buttons}>
        <button onClick={() => setModal(true)}>Редактировать</button>
        <button onClick={onDelete}>Удалить</button>
      </div>

      {modal && (
        <EditItemModal
          type="document"
          data={doc}
          parentId={parentId}
          onClose={() => setModal(false)}
          onUpdated={() => setModal(false)}
        />
      )}
    </div>
  );
};

export default DocumentItemComponent;
