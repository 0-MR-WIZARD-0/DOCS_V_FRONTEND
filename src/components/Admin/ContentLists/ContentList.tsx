"use client";

import styles from "@/components/Admin/ContentLists/ContentList.module.scss";

import api from "@/app/api/api";

import EditSectionModal from "../EditModal/EditModal";
import SectionBlock from "@/components/Admin/ContentLists/SubComponents/SectionBlock";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";

import { fetchSections } from "@/store/slices/sectionsSlice";
import { fetchSubsections} from "@/store/slices/subsectionsSlice";
import { fetchDocuments } from "@/store/slices/documentsSlice";

import { Section } from "@/types/section";
import { Subsection } from "@/types/subSection";
import { Document } from "@/types/document";

export type ModalType =
  | { type: "section"; data: Section }
  | { type: "subsection"; data: Subsection; parentId: number }
  | { type: "document"; data: Document };

export type MoveItemFn = (
  allItems: Document[] | Section[] | Subsection[],
  itemId: number,
  type: "sections" | "subsections" | "documents",
  direction: "up" | "down",
  order?: number 
) => Promise<void>;

const ContentList: React.FC = () => {
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

  const moveItem: MoveItemFn = async (allItems, itemId, type, direction, order) => {
  if (isLoading) return;

  const item = allItems.find((i) => i.id === itemId);
  if (!item) return;

  const currentIndex = allItems.findIndex((i) => i.id === item.id);
  if (currentIndex === -1) return;

  let newOrder = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  let newOrderSub = direction === "up" ? order! - 1 : order! + 1;

  if (newOrder < 0) newOrder = 0;
  if (newOrder >= allItems.length) newOrder = allItems.length;

  if (newOrderSub! < 0) newOrderSub = 0;
  if (newOrderSub! >= allItems.length) newOrderSub = allItems.length;

  setIsLoading(true);

  try {

    if (type === "sections") {
      await api.put(`/sections/${item.id}/move/${newOrder + 1}`);
    } else if (type === "subsections") {
      await api.put(`/subsections/${item.id}/move/${newOrderSub}`);
    } else if (type === "documents") {
      await api.put(`/documents/${item.id}/move/${newOrderSub}`);
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

export default ContentList;
