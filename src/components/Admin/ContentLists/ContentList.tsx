"use client";
import styles from "@/components/Admin/ContentLists/ContentList.module.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import EditSectionModal from "../EditSectionModal/EditSectionModal";
import SectionBlock from "./SubComponents/SectionBlock";
import api from "@/services/api";

import { fetchSections } from "@/store/slices/sectionsSlice";
import { fetchSubsections } from "@/store/slices/subsectionsSlice";
import { fetchDocuments } from "@/store/slices/documentsSlice";
import { Section } from "@/types/section";
import { Subsection } from "@/types/subSection";
import { Document } from "@/types/document";

export type ModalType =
  | { type: "section"; data: Section }
  | { type: "subsection"; data: Subsection; parentId: number }
  | { type: "document"; data: Document };

export type MoveItemFn = <T extends { id: number; order: number }>(
  allItems: T[],
  fromIndex: number,
  toIndex: number,
  type: "sections" | "subsections" | "documents",
  parentId?: number
) => Promise<void>;

const SectionList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const sections = useSelector((state: RootState) => state.sections.items);
  const subsections = useSelector((state: RootState) => state.subsections.items);
  const documents = useSelector((state: RootState) => state.documents.items);

  const [modal, setModal] = useState<ModalType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchSections());
    dispatch(fetchSubsections());
    dispatch(fetchDocuments());
  }, [dispatch]);

  const moveItem: MoveItemFn = async (allItems, fromIndex, toIndex, type) => {
    if (isLoading) return;
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= allItems.length || toIndex >= allItems.length) return;

    setIsLoading(true);
    try {
      const updated = [...allItems];
      const item = { ...updated[fromIndex] };
      updated[fromIndex] = updated[toIndex];
      updated[toIndex] = item;

      const newOrder = toIndex + 1; 
      if (type === "sections") await api.put(`/sections/${item.id}/move/${newOrder}`);
      else if (type === "subsections") await api.put(`/subsections/${item.id}/move/${newOrder}`);
      else await api.put(`/documents/${item.id}/move/${newOrder}`);

      dispatch(fetchSections());
      dispatch(fetchSubsections());
      dispatch(fetchDocuments());

    } catch (err) {
      console.error("Failed to move item:", err);
      alert("Не удалось переместить элемент");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper_sectionList}>
      {sections
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((section, i) => (
          <SectionBlock
            key={section.id}
            section={section}
            index={i}
            sections={sections}
            moveItem={moveItem}
            isLoading={isLoading}
            setModal={setModal}
            documents={documents}
            subsections={subsections}
          />
        ))}

      {modal && (
        <EditSectionModal
          type={modal.type}
          data={modal.data}
          parentId={"parentId" in modal ? modal.parentId : undefined}
          onClose={() => setModal(null)}
          onUpdated={() => {
            dispatch(fetchSections());
            dispatch(fetchSubsections());
            dispatch(fetchDocuments());
          }}
        />
      )}
    </div>
  );
};

export default SectionList;
