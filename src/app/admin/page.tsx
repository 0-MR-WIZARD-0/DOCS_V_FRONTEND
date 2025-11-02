"use client";
import { useState } from "react";
import UploadDocumentForm from "@/components/Admin/UploadForm/UploadForm";
import DocumentsList from "@/components/Admin/DocumentsList/DocumentsList";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "list">("upload");

  return (
    <div style={{ padding: 20 }}>
      <h1>Админка документов</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setActiveTab("upload")} disabled={activeTab === "upload"}>
          Загрузка документа
        </button>
        <button onClick={() => setActiveTab("list")} disabled={activeTab === "list"} style={{ marginLeft: 10 }}>
          Список документов
        </button>
      </div>

      {activeTab === "upload" ? <UploadDocumentForm /> : <DocumentsList />}
    </div>
  );
}
