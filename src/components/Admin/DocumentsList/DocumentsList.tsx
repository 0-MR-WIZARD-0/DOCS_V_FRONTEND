"use client";

import styles from "@/components/Admin/DocumentsList/DocumentsList.module.scss"
import { useEffect, useState } from "react";
import api from "@/services/api";
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
    <div className={styles.admin_list_wrapper}>
      {docs.map((doc) => (
            <div key={doc.id}>
              <div>
                <a href={doc.path ? `http://localhost:4000/${doc.path}` : undefined}
                  target="_blank"
                  rel="noreferrer">{doc.title}</a>
                <p>{new Date(doc.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setEditingDoc(doc)}>Редактировать</button>
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