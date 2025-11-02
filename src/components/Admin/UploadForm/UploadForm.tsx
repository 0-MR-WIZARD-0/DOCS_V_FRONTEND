"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function UploadDocumentForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Документ загружен!");
      setFile(null);
      setTitle("");
    } catch (err) {
      console.error(err);
      setMessage("Ошибка загрузки");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Название документа:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Файл:</label>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
      </div>
      <button type="submit">Загрузить</button>
      {message && <p>{message}</p>}
    </form>
  );
}
