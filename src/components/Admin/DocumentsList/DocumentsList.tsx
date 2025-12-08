"use client";

import styles from "@/components/Admin/DocumentsList/DocumentsList.module.scss";

import api from "@/services/api";

import { useEffect, useState } from "react";
import EditDocumentModal from "@/components/Admin/EditDocumentModal/EditDocumentModal";

import { Document } from "@/types/document";

export default function DocumentsList() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchDocs = async (): Promise<Document[]> => {
    try {
      const res = await api.get("/documents");
      return res.data;
    } catch (err) {
      console.error("Failed to load documents:", err);
      alert("Failed to load documents.");
      return [];
    }
  };

  useEffect(() => {
    fetchDocs().then(setDocs);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete document permanently?")) return;

    try {
      setDeletingId(id);
      await api.delete(`/documents/${id}`);
      setDocs((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error("Failed to delete document:", err);
      alert("Failed to delete document.");
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
                href={
                  doc.path
                    ? `${process.env.NEXT_PUBLIC_API_URL}/${doc.path}`
                    : undefined
                }
                target="_blank"
                rel="noreferrer"
              >
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