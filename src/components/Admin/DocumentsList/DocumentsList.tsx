"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import EditDocumentModal from "@/components/Admin/EditDocumentModal/EditDocumentModal";

interface Document {
  id: number;
  filename: string;
  path: string;
  title?: string;
  createdAt: string;
}

export default function DocumentsList() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);

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

  return (
    <div>
      <table border={1} cellPadding={8} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Название документа</th>
            <th>Файл</th>
            <th>Дата добавления</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.title || doc.filename}</td>
              <td>
                <a href={doc.path ? `http://localhost:4000/${doc.path}` : undefined}
                   target="_blank"
                   rel="noreferrer">
                Открыть
                </a>
              </td>
              <td>{new Date(doc.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => setEditingDoc(doc)}>Редактировать</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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