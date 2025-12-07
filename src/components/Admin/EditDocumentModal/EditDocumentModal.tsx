"use client";

import styles from "@/components/Admin/EditDocumentModal/EditDocumentModal.module.scss"
import { useState } from "react";
import api from "@/services/api";
import { Document } from "@/types/document";
import { allowedTypes } from "@/types/allowedTypes";

interface Props {
  document: Document;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditDocumentModal({ document, onClose, onUpdated }: Props) {

  const [message, setMessage] = useState("");
  const [title, setTitle] = useState(document.title || "");
  const [description, setDescription] = useState(document.description || "");
  const [category, setCategory] = useState(document.category.name || "");
  const [date, setDate] = useState(document.createdAt || "");
  const [file, setFile] = useState<File | null>(null);
  const [removeFile, setRemoveFile] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file && !allowedTypes.includes(file.type)) {
      setMessage("Недопустимый формат файла. Разрешены: PDF, Word, Excel.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("createdAt", date);

    if (file) {
      formData.append("file", file);
      setRemoveFile(false);
    } else if (removeFile) {
      formData.append("removeFile", "true");
    }

    await api.put(`/documents/${document.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    onUpdated();
    onClose();
  };

  return (
    <div className={styles.edit_modal_wrapper}>
      <div>
        <h2>Редактировать документ</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название"/>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание"></textarea>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Категория"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                if (f && !allowedTypes.includes(f.type)) {
                  setMessage("Разрешены только PDF, Word и Excel файлы");
                  e.target.value = "";
                  setFile(null);
                  return;
                }
                setMessage("");
                setFile(f);
              }}
            />
            <span>Выберите файл</span>
          </label>
          
          {document.path && !file && (
            <span>
              <input
              type="checkbox"
              checked={removeFile}
              onChange={(e) => setRemoveFile(e.target.checked)}
            /> Удалить текущий файл</span>
          )}

          {message && <p>{message}</p>}

          <button type="submit">Сохранить</button>
          <button type="button" onClick={onClose}>Отмена</button>
        </form>
      </div>
    </div>
  )
}