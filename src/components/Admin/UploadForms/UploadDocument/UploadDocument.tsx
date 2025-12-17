"use client";

import styles from "@/components/Admin/UploadForms/UploadDocument/UploadDocument.module.scss";
import { useState, useEffect } from "react";
import api from "@/app/api/api";
import { allowedTypes } from "@/types/allowedTypes";
import { useAppDispatch } from "@/store/hooks";
import { fetchDocuments } from "@/store/slices/documentsSlice";
import { Section } from "@/types/section";

export default function UploadDocument() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedSubsectionId, setSelectedSubsectionId] = useState("");
  const [isSub, setIsSub] = useState(false);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadSections = async () => {
      try {
        const res = await api.get("/sections");
        setSections(res.data ?? []);
      } catch (err) {
        console.error("Failed to load sections:", err);
        setMessage("Ошибка загрузки разделов.");
      }
    };
    loadSections();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (file && !allowedTypes.includes(file.type)) {
      setMessage("Invalid file format. Allowed: PDF, Word, Excel.");
      return;
    }

    if (!selectedSectionId && !isSub) {
      setMessage("Выберите раздел.");
      return;
    }

    if (isSub && !selectedSubsectionId) {
      setMessage("Выберите подраздел.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    // formData.append("createdAt", date);
    if (file) formData.append("file", file);

    formData.append(
      "data",
      JSON.stringify({
        title,
        description,
        // createdAt: date,
        sectionId: !isSub ? Number(selectedSectionId) : null,
        subsectionId: isSub ? Number(selectedSubsectionId) : null,
      })
    );

    try {
      setIsLoading(true);

      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(fetchDocuments());

      setMessage("Документ успешно загружен.");
      setTitle("");
      setDescription("");
      // setDate("");
      setFile(null);
      setSelectedSectionId("");
      setSelectedSubsectionId("");
      setIsSub(false);

    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Ошибка загрузки документа.");
    } finally {
      setIsLoading(false);
    }
  };

  const subsections =
    isSub && selectedSectionId
      ? sections.find((s) => s.id === Number(selectedSectionId))?.subsections ?? []
      : [];

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
        <select
          value={selectedSectionId}
          onChange={(e) => {
            setSelectedSectionId(e.target.value);
            setSelectedSubsectionId("");
          }}
          disabled={isLoading}
          required
        >
          <option value="">Выберите раздел</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={isSub}
            style={{ marginBottom: "10px" }}
            onChange={(e) => {
              setIsSub(e.target.checked);
              setSelectedSubsectionId("");
            }}
            disabled={isLoading}
          />
          {" "}Это подраздел
        </label>
        {isSub && (
          <select
            value={selectedSubsectionId}
            onChange={(e) => setSelectedSubsectionId(e.target.value)}
            disabled={isLoading}
            required
          >
            <option value="">Выберите подраздел</option>
            {subsections.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        )}
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
        {message && <p style={{ marginTop: "20px" }}>{message}</p>}
      </div>
    </form>
  );
}
