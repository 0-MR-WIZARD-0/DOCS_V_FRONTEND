"use client";

import { useState, useEffect } from "react";
import api from "@/app/api/api";
import { allowedTypes } from "@/types/allowedTypes";
import { Document } from "@/types/document";
import styles from "../EditModal/EditModal.module.scss"
import { Section } from "@/types/section";
import { Subsection } from "@/types/subSection";
import { fetchDocuments } from "@/store/slices/documentsSlice";
import { useAppDispatch } from "@/store/hooks";

export type Item = Section | Subsection | Document;

interface EditItemModalProps<T extends Item> {
  type: "section" | "subsection" | "document";
  data: T;
  parentId?: number;
  onClose: () => void;
  onUpdated: (updatedItem: T | undefined) => void;
}

export default function EditModal<T extends Item>({
  type,
  data,
  parentId,
  onClose,
  onUpdated
}: EditItemModalProps<T>) {

  const isSection = type === "section";
  const isSubsection = type === "subsection";
  const isDoc = type === "document";

  const [name, setName] = useState(
    (isSection || isSubsection ? (data as Section | Subsection).name : "")
  );

  const [description, setDescription] = useState(
    (isSection || isSubsection ? (data as Section | Subsection).description ?? "" : "")
  );

  const doc = isDoc ? (data as Document) : null;

  const [title, setTitle] = useState(isDoc ? doc!.title : "");
  const [docDescription, setDocDescription] = useState(isDoc ? doc!.description ?? "" : "");

  const [selectedSectionId, setSelectedSectionId] = useState(
    isDoc ? doc!.sectionId ?? "" : ""
  );
  const [selectedSubsectionId, setSelectedSubsectionId] = useState(
    isDoc ? doc!.subsectionId ?? "" : ""
  );

  const [isSub, setIsSub] = useState(isDoc ? !!doc!.subsectionId : false);

  const [file, setFile] = useState<File | null>(null);
  const [removeFile, setRemoveFile] = useState(false);

  const [sections, setSections] = useState<Section[]>([]);
  const [message, setMessage] = useState("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isDoc) return;

    api.get("/sections")
      .then(res => setSections(res.data ?? []))
      .catch(() => setMessage("Ошибка загрузки разделов"));
  }, [isDoc]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (isSection) {
      if (!name.trim()) return setMessage("Название не может быть пустым");

      const res = await api.put(`/sections/${data.id}`, { 
        name, 
        description 
      });

      onUpdated(res.data as T);
      onClose();
      return;
    }

    if (isSubsection) {
      if (!name.trim()) return setMessage("Название не может быть пустым");

      const res = await api.put(`/subsections/${data.id}`, {
        name,
        description,
        sectionId: parentId
      });

      onUpdated(res.data as T);
      onClose();
      return;
    }

  if (isDoc) {
  if (!title.trim()) return setMessage("Название документа не может быть пустым");

  const formData = new FormData();
  formData.append(
    "data",
    JSON.stringify({
      title,
      description: docDescription,
      sectionId: !isSub ? Number(selectedSectionId) || undefined : undefined,
      subsectionId: isSub ? Number(selectedSubsectionId) || undefined : undefined,
      removeFile: removeFile || undefined
    })
  );

  if (file) formData.append("file", file);

  try {
    const res = await api.put(`/documents/${doc!.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    const updated = res.data as Document;

        const safeUpdated = {
          ...updated,
          sectionId: updated.sectionId ?? doc!.sectionId,
          subsectionId: updated.subsectionId ?? doc!.subsectionId
        } as T;
        onUpdated(safeUpdated);
        dispatch(fetchDocuments());
        onClose();
        return;
      } catch (err) {
        console.error(err);
        return setMessage("Ошибка при обновлении документа");
      }
    }
  }

  const subsections =
    isSub && selectedSectionId
      ? sections.find(s => s.id === Number(selectedSectionId))?.subsections ?? []
      : [];

  return (
    <div className={styles.edit_modal_wrapper}>
      <div>
        <h2>Редактировать {isSection ? "раздел" : isSubsection ? "подраздел" : "документ"}</h2>
        <form onSubmit={handleSubmit}>

          {(isSection || isSubsection) && (
            <>
              <input
                type="text"
                placeholder="Название"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <textarea
                placeholder="Описание"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </>
          )}

          {isDoc && (
            <>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Название документа"
              />
              <textarea
                placeholder="Описание"
                value={docDescription}
                onChange={e => setDocDescription(e.target.value)}
              />
            <select
              value={selectedSectionId}
              onChange={e => {
                setSelectedSectionId(e.target.value);
                setSelectedSubsectionId("");
              }}
            >
              <option value="">Выберите раздел</option>
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <label>
              <input
                type="checkbox"
                checked={isSub}
                style={{ marginBottom: "10px" }}
                onChange={e => {
                  setIsSub(e.target.checked);
                  setSelectedSubsectionId("");
                }}
              />
              {" "}Это подраздел
            </label>
            {isSub && (
              <select
                value={selectedSubsectionId}
                onChange={e => setSelectedSubsectionId(e.target.value)}
              >
                <option value="">Выберите подраздел</option>
                {subsections.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            )}
            {!file && (
              <button
                type="button"
                onClick={() => document.getElementById('fileInput')?.click()}
                style={{ marginBottom: "10px" }}
              >
                Добавить файл
              </button>
            )}
            <input
              type="file"
              id="fileInput"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              style={{ display: "none" }}
              onChange={e => {
                const f = e.target.files?.[0] ?? null;
                if (f && !allowedTypes.includes(f.type)) {
                  setMessage("Неверный формат файла");
                  return setFile(null);
                }
                setFile(f);
              }}
            />

            {doc?.path && !file && (
              <label>
                <input
                  type="checkbox"
                  checked={removeFile}
                  onChange={e => setRemoveFile(e.target.checked)}
                /> Удалить текущий файл
              </label>
            )}
            </>
          )}

          <button type="submit" >Сохранить</button>
          <button type="button" onClick={onClose}>Отмена</button>

          {message && (<p>{message}</p>)}

        </form>
      </div>
    </div>
  );
}