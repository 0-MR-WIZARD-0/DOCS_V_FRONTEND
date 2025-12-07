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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/categories");
        console.log(res);
        
        setAllCategories(res.data || []);
      } catch (err) {
        console.error("Не удалось загрузить категории", err);
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

  if (file && !allowedTypes.includes(file.type)) {
    setMessage("Недопустимый формат файла. Разрешены: PDF, Word, Excel.");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description)
  formData.append("category", category);
  formData.append("createdAt", date);

  if (file) {
    formData.append("file", file);
  }

  try {
    await api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setMessage("Документ загружен!");
  } catch (err) {
    console.error(err);
    setMessage("Ошибка загрузки");
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
          placeholder="Название"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Категория"
          required
        />
        {filteredCategories.length > 0 && (
          <ul>
            {filteredCategories.map((c) => (
              <li
                key={c}
                onClick={() => {
                  setCategory(c);
                }}
                style={{ cursor: "pointer" }}
              >
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
        />
        <div className={styles.file}>
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
        </div>
        <button type="submit">Загрузить</button>
        {message && <p>{message}</p>}
      </div>
    </form>
  );
}
