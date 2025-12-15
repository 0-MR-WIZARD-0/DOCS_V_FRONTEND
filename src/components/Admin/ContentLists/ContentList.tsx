/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@/components/Admin/ContentLists/ContentList.module.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import EditSectionModal from "../EditSectionModal/EditSectionModal";
import api from "@/services/api";

import { fetchSections, updateSections } from "@/store/slices/sectionsSlice";
import { fetchSubsections, updateSubsections, updateSubsectionsOrder } from "@/store/slices/subsectionsSlice";
import { fetchDocuments, updateDocuments } from "@/store/slices/documentsSlice";
import { Section } from "@/types/section";
import { Subsection } from "@/types/subSection";
import { Document } from "@/types/document";
import SectionBlock from "./SubComponents/SectionBlock";

export type ModalType =
  | { type: "section"; data: Section }
  | { type: "subsection"; data: Subsection; parentId: number }
  | { type: "document"; data: Document };

export type MoveItemFn = (
  allItems: Document[] | Section[] | Subsection[],
  itemId: number,
  type: "sections" | "subsections" | "documents",
  direction: "up" | "down"
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

  const moveItem: MoveItemFn = async (allItems, itemId, type, direction) => {
  if (isLoading) return;

  const item = allItems.find((i) => i.id === itemId);
  if (!item) return;

  const currentIndex = allItems.findIndex((i) => i.id === item.id);
  if (currentIndex === -1) return;

  let newOrder = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (newOrder < 0) newOrder = 1;
  if (newOrder >= allItems.length) newOrder = allItems.length - 1;

  setIsLoading(true);

  try {

    if (type === "sections") {
      await api.put(`/sections/${item.id}/move/${newOrder + 1}`);
    } else if (type === "subsections") {
      console.log(item);
      if (direction === "up"){
        console.log(`/subsections/${item.id}/move/${newOrder}`);
        // await api.put(`/subsections/${item.id}/move/${newOrder}`);
      }else if(direction === "down"){
        console.log(`/subsections/${item.id}/move/${newOrder+1}`);
        // await api.put(`/subsections/${item.id}/move/${newOrder+1}`);
      }
    } else if (type === "documents") {
      // await api.put(`/documents/${item.id}/move/${newOrder + 1}`);
    }

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
