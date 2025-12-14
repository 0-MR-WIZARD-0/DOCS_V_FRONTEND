"use client";

import styles from "@/components/Admin/UploadForms/UploadSection/UploadSection.module.scss";
import { useState, useEffect } from "react";
import api from "@/services/api";

export default function ManageSections() {
  const [sections, setSections] = useState<{ id: number; name: string }[]>([]);
  const [sectionName, setSectionName] = useState("");
  const [subsectionName, setSubsectionName] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [sectionDescription, setSectionDescription] = useState("");
  const [subsectionDescription, setSubsectionDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadSections = async () => {
    try {
      const res = await api.get("/sections");
      setSections(res.data ?? []);
    } catch (err) {
      console.error("Failed to load sections:", err);
      setMessage("Failed to load sections.");
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!sectionName.trim()) {
      setMessage("Section name is required.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post("/sections", {
        name: sectionName,
        description: sectionDescription,
      });

      setSections((prev) => [...prev, res.data]);
      setSectionName("");
      setSectionDescription("");
      setMessage("Раздел успешно создан.");
    } catch (err) {
      console.error("Create section error:", err);
      setMessage("Failed to create section.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubsection = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!subsectionName.trim() || !selectedSectionId) {
      setMessage("Subsection name and section selection are required.");
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/subsections", {
        name: subsectionName,
        description: subsectionDescription,
        sectionId: selectedSectionId,
      });

      setSubsectionName("");
      setSubsectionDescription("");
      setMessage("Подраздел успешно создан.");
    } catch (err) {
      console.error("Create subsection error:", err);
      setMessage("Failed to create subsection.");
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
          required
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
          onChange={(e) => setSelectedSectionId(Number(e.target.value))}
          required
          disabled={isLoading}
        >
          <option value="" disabled>
            Выберите раздел
          </option>
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
          required
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

      {message && <p>{message}</p>}
    </div>
  );
}