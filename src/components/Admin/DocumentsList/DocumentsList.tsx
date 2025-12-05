"use client";

import styles from "@/components/Admin/DocumentsList/DocumentsList.module.scss";
import { useEffect, useState } from "react";
import api from "@/services/api";
import EditDocumentModal from "@/components/Admin/EditDocumentModal/EditDocumentModal";
import { Document } from "@/types/document";

export default function DocumentsList() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchDocs = async (): Promise<Document[]> => {
    const res = await api.get("/documents");
    return res.data;
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDocs();
      setDocs(data);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить документ безвозвратно?")) return;

    try {
      setDeletingId(id);
      await api.delete(`/documents/${id}`);
      setDocs((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error("Ошибка при удалении документа:", err);
      alert("Ошибка при удалении документа");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.admin_list_wrapper}>
      {docs.map((doc) => (
        <div key={doc.id}>
          <div>
            <h4>
              <a
                href={doc.path ? `http://localhost:4000/${doc.path}` : undefined}
                target="_blank"
                rel="noreferrer">
              {doc.title || doc.filename}
              </a>
            </h4>
            <p>{doc.description}</p>
            <p>{new Date(doc.createdAt).toLocaleString()}</p>
          </div>
          <button onClick={() => setEditingDoc(doc)}>Редактировать</button>
          <button
            onClick={() => handleDelete(doc.id)}
            disabled={deletingId === doc.id}
          >
            {deletingId === doc.id ? "Удаляется..." : "Удалить"}
          </button>
        </div>
      ))}

      {editingDoc && (
        <EditDocumentModal
          document={editingDoc}
          onClose={() => setEditingDoc(null)}
          onUpdated={() => fetchDocs().then(setDocs)}
        />
      )}
    </div>
  );
}
  