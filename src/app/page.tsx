"use client";

import DocumentView from "@/components/DocumentView/DocumentView";
import SearchBar from "@/components/SearchBar/SearchBar";
import api from "@/services/api";
import { Document } from "@/types/document";
import { SearchFilters } from "@/types/searchFilters";
import { useEffect, useState, useCallback } from "react";

export default function Home() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const loadAllDocs = useCallback(async () => {
    try {
      const res = await api.get("/documents");
      setDocs(res.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    loadAllDocs();
  }, [loadAllDocs]);

  const handleSearchResults = useCallback(
    (data: Document[], filters: SearchFilters) => {
      const { query, dateFrom, dateTo } = filters;
      const hasFilters = query.trim() || dateFrom || dateTo;
      if (!hasFilters) {
        setIsSearching(false);
        Promise.resolve().then(() => loadAllDocs());
        return;
      }
      setIsSearching(true);
      setDocs(data);
    },
    [loadAllDocs]
  );

  const docsByCategory = !isSearching ? docs.reduce<Record<string, Document[]>>((acc, doc) => {
    const catName = doc.category?.name || "Без категории";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(doc);
    return acc;
  }, {}) : {};

  return (
    <div>
      <SearchBar onResults={handleSearchResults} />
      {isSearching ? (
        docs.length > 0 ? (
          docs.map((doc) => (
            <DocumentView
              key={doc.id}
              name={doc.title}
              description={doc.description}
              date={doc.createdAt}
              url={doc.path ? `${process.env.NEXT_PUBLIC_API_URL}/${doc.path}` : undefined}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Документы не найдены
          </p>
        )
      ) : Object.keys(docsByCategory).length > 0 ? (
        Object.entries(docsByCategory).map(([category, documents]) => (
          <div key={category}>
            <h2 style={{ margin: "20px 20px 0 20px" }}>{category}</h2>
            {documents.map((doc) => (
              <DocumentView
                key={doc.id}
                name={doc.title}
                description={doc.description}
                date={doc.createdAt}
                url={doc.path ? `${process.env.NEXT_PUBLIC_API_URL}/${doc.path}` : undefined}
              />
            ))}
            <hr style={{ margin: "0 20px 20px 20px", borderStyle: "dashed" }} />
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Документы не найдены
        </p>
      )}
    </div>
  );
}
