"use client";

import styles from "@/components/Admin/EditDocumentModal/EditDocumentModal.module.scss"
import { useState } from "react";
import api from "@/services/api";
import { Document } from "@/types/document";

interface Props {
  document: Document;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditDocumentModal({ document, onClose, onUpdated }: Props) {

  const [title, setTitle] = useState(document.title || "");
  const [description, setDescription] = useState(document.description || "");
  const [category, setCategory] = useState(document.category.name || "");
  const [date, setDate] = useState(document.createdAt || "");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("createdAt", date);
    if (file) formData.append("file", file);

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
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название"/>
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
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)}/>
            <span>Выберите файл</span>
          </label>
          <button type="submit">Сохранить</button>
          <button type="button" onClick={onClose}>Отмена</button>
        </form>
      </div>
    </div>
  )
}