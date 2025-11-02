"use client";
import { useState } from "react";
import api from "@/lib/api";

interface Props {
  document: { id: number; title?: string };
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditDocumentModal({ document, onClose, onUpdated }: Props) {
  const [title, setTitle] = useState(document.title || "");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    if (file) formData.append("file", file);

    await api.put(`/documents/${document.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    onUpdated();
    onClose();
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "#00000088" }}>
      <div style={{ background: "#fff", padding: 20, margin: "50px auto", width: 400 }}>
        <h2>Редактировать документ</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Название документа:</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label>Заменить файл:</label>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <button type="submit">Сохранить</button>
          <button type="button" onClick={onClose} style={{ marginLeft: 10 }}>
            Отмена
          </button>
        </form>
      </div>
    </div>
  );
}
