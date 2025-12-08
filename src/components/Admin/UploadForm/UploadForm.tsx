"use client";

import styles from "@/components/Admin/UploadForm/UploadForm.module.scss";
import { useState, useEffect, useMemo } from "react";
import api from "@/services/api";
import { allowedTypes } from "@/types/allowedTypes";

export default function UploadDocumentForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/categories");
        setAllCategories(res.data ?? []);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setMessage("Failed to load categories.");
      }
    };

    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!category.trim()) return [];
    return allCategories.filter((c) =>
      c.toLowerCase().includes(category.toLowerCase())
    );
  }, [category, allCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (file && !allowedTypes.includes(file.type)) {
      setMessage("Invalid file format. Allowed: PDF, Word, Excel.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("createdAt", date);
    if (file) formData.append("file", file);

    try {
      setIsLoading(true);

      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Документ успешно загружен.");
      setTitle("");
      setDescription("");
      setCategory("");
      setDate("");
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form_wrapper}>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Название документа"
          disabled={isLoading}
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание"
          disabled={isLoading}
        />

        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Категория"
          required
          disabled={isLoading}
        />

        {filteredCategories.length > 0 && (
          <ul>
            {filteredCategories.map((c) => (
              <li key={c} onClick={() => setCategory(c)}>
                {c}
              </li>
            ))}
          </ul>
        )}

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={isLoading}
        />

        <div className={styles.file}>
          <label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;

                if (f && !allowedTypes.includes(f.type)) {
                  setMessage("Only PDF, Word and Excel files are allowed.");
                  setFile(null);
                  e.target.value = "";
                  return;
                }

                setMessage("");
                setFile(f);
              }}
              disabled={isLoading}
            />
            <span>{isLoading ? "Загрузка файла..." : "Выберите файл"}</span>
          </label>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Создание..." : "Загрузить"}
        </button>

        {message && <p>{message}</p>}
      </div>
    </form>
  );
}
