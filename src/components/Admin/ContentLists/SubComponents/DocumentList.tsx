import { PropsDocumentList } from "@/types/document";
import DocumentItemComponent from "./DocumentItem";
import { useMemo } from "react";

const DocumentList: React.FC<PropsDocumentList> = ({ docs, sectionId, subsectionId, moveItem }) => {

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
