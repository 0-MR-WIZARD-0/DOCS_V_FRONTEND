"use client";

import styles from "@/components/Admin/UploadForms/UploadSection/UploadSection.module.scss";
import { useCallback, useEffect, useState } from "react";
import api from "@/app/api/api";
import { Section } from "@/types/section";

type Message =
  | { type: "success"; text: string }
  | { type: "error"; text: string }
  | null;

export default function ManageSections() {
  const [sections, setSections] = useState<Pick<Section, "id" | "name">[]>([]);

  const [sectionName, setSectionName] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");

  const [subsectionName, setSubsectionName] = useState("");
  const [subsectionDescription, setSubsectionDescription] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);

  const [message, setMessage] = useState<Message>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadSections = useCallback(async () => {
    try {
      const res = await api.get("/sections");

      setSections(
        Array.isArray(res.data)
          ? res.data.map((s) => ({ id: s.id, name: s.name }))
          : []
      );
    } catch (err) {
      console.error("Failed to load sections:", err);
      setMessage({ type: "error", text: "Не удалось загрузить разделы." });
    }
  }, []);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!sectionName.trim()) {
      setMessage({ type: "error", text: "Название раздела обязательно." });
      return;
    }

    try {
      setIsLoading(true);

      await api.post("/sections", {
        name: sectionName,
        description: sectionDescription,
      });

      await loadSections();

      setSectionName("");
      setSectionDescription("");
      setMessage({ type: "success", text: "Раздел успешно создан." });
    } catch (err) {
      console.error("Create section error:", err);
      setMessage({ type: "error", text: "Ошибка при создании раздела." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubsection = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!subsectionName.trim() || !selectedSectionId) {
      setMessage({
        type: "error",
        text: "Выберите раздел и укажите название подраздела.",
      });
      return;
    }

    try {
      setIsLoading(true);

      await api.post("/subsections", {
        name: subsectionName,
        description: subsectionDescription,
        sectionId: selectedSectionId,
      });

      await loadSections();

      setSubsectionName("");
      setSubsectionDescription("");
      setSelectedSectionId(null);
      setMessage({ type: "success", text: "Подраздел успешно создан." });
    } catch (err) {
      console.error("Create subsection error:", err);
      setMessage({
        type: "error",
        text: "Ошибка при создании подраздела.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.form_wrapper_uploadSection}>
      <form onSubmit={handleCreateSection}>
        <h3>Создать раздел</h3>
        <input
          type="text"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          placeholder="Название раздела"
          disabled={isLoading}
        />
        <textarea
          value={sectionDescription}
          onChange={(e) => setSectionDescription(e.target.value)}
          placeholder="Описание раздела"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Создание..." : "Создать раздел"}
        </button>
      </form>

      <form onSubmit={handleCreateSubsection}>
        <h3>Создать подраздел</h3>
        <select
          value={selectedSectionId ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedSectionId(value ? Number(value) : null);
          }}
          disabled={isLoading}
        >
          <option value="">Выберите раздел</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={subsectionName}
          onChange={(e) => setSubsectionName(e.target.value)}
          placeholder="Название подраздела"
          disabled={isLoading}
        />
        <textarea
          value={subsectionDescription}
          onChange={(e) => setSubsectionDescription(e.target.value)}
          placeholder="Описание подраздела"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Создание..." : "Создать подраздел"}
        </button>
      </form>
      {message && (<p style={{color: message.type === "error" ? "red" : "green"}}>{message.text}</p>)}
    </div>
  );
}
