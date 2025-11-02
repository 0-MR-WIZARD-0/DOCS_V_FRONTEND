'use client'

import DocumentView from "@/components/DocumentView/DocumentView";
import SearchBar from "@/components/SearchBar";
import api from "@/lib/api";
import { useEffect, useState } from "react";

interface Document {
  id: number;
  title: string;
  path: string;
  createdAt: string;
}

export default function Home() {
  const [docs, setDocs] = useState<Document[]>([]);

  const fetchDocs = async (q = '', from = '', to = ''): Promise<Document[]> => {
    const res = await api.get('/documents', { params: { q, from, to } });
    return res.data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDocs();
        setDocs(data);
        console.log(data);
        
      } catch (err) {
        console.error("Ошибка загрузки документов:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <SearchBar/>

      {docs.map(doc => (
        
        <DocumentView
          key={doc.id}
          name={doc.title}
          date={doc.createdAt}
          url={`http://localhost:4000/${doc.path}`}
        />
      ))}
    </div>
  );
}
