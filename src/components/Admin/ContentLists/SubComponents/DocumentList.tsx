import { Document } from "@/types/document";
import DocumentItemComponent from "./DocumentItem";
import { MoveItemFn } from "../ContentList";
import { useMemo } from "react";

interface Props {
  docs: Document[];
  sectionId?: number;
  subsectionId?: number;
  moveItem: MoveItemFn;
}

const DocumentList: React.FC<Props> = ({ docs, sectionId, subsectionId, moveItem }) => {

  const sortedDocs = useMemo(
    () => [...docs].sort((a, b) => a.order - b.order),
    [docs]
  );

  return (
    <>
      {sortedDocs.map((doc, index) => (
          <DocumentItemComponent
            key={doc.id}
            doc={doc}
            docs={docs}
            index={index}
            moveItem={moveItem}
            sectionId={sectionId}
            subsectionId={subsectionId}
          />
        ))}
    </>
  );
};

export default DocumentList;
