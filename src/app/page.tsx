"use client";

import api from "@/services/api";

import { Section } from "@/types/section";
import { Document } from "@/types/document";
import { SearchFilters } from "@/types/searchFilters";

import { useEffect, useState, useCallback } from "react";

import SearchBar from "@/components/SearchBar/SearchBar";
import DocumentView from "@/components/DocumentView/DocumentView";

export default function Home() {
  const [sections, setSections] = useState<Section[]>([]);
  const [searchedDocs, setSearchedDocs] = useState<Document[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const loadStructure = useCallback(async () => {
    try {
      const res = await api.get("/sections");
      console.log(res.data);
      
      setSections(
        Array.isArray(res.data)
          ? res.data.sort((a: Section, b: Section) => a.order - b.order)
          : []
      );
    } catch (e) {
      console.error("Failed to load sections:", e);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStructure();
    const interval = setInterval(loadStructure, 20000);
    return () => clearInterval(interval);
  }, [loadStructure]);

  const handleSearchResults = useCallback(
    (docs: Document[], filters: SearchFilters) => {
      const { query, dateFrom, dateTo } = filters;
      const hasFilters = query.trim() || dateFrom || dateTo;

      if (!hasFilters) {
        setIsSearching(false);
        setTimeout(() => {
          loadStructure();
        }, 0);
        return;
      }

      setIsSearching(true);
      setSearchedDocs(docs);
    },
    [loadStructure]
  );

  return (
    <div style={{ paddingBottom: 50 }}>
      <SearchBar onResults={handleSearchResults} />

      {isSearching ? (
        searchedDocs.length ? (
          searchedDocs.map((doc) => (
            <DocumentView
              key={doc.id}
              name={doc.title}
              description={doc.description}
              date={doc.createdAt ?? ""}
              url={
                doc.path
                  ? `${process.env.NEXT_PUBLIC_API_URL}/${doc.path}`
                  : undefined
              }
            />
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: 20 }}>Ничего не найдено</p>
        )
      ) : (
        <>
          {sections.map((section) => (
            <div key={section.id} style={{ marginBottom: 40 }}>
              <h2 style={{ margin: "20px" }}>{section.name}</h2>

              {section.description && (
                <p style={{ margin: "0 20px 20px" }}>{section.description}</p>
              )}

              {section.documents
                ?.sort((a, b) => a.order - b.order)
                .map((doc) => (
                  <DocumentView
                    key={doc.id}
                    name={doc.title}
                    description={doc.description}
                    date={doc.createdAt}
                    url={
                      doc.path
                        ? `${process.env.NEXT_PUBLIC_API_URL}/${doc.path}`
                        : undefined
                    }
                  />
                ))}

              {section.subsections
                ?.sort((a, b) => a.order - b.order)
                .map((sub) => (
                  <div key={sub.id} style={{ marginLeft: 30, marginTop: 25 }}>
                    <h3 style={{ margin: "10px 0" }}>{sub.name}</h3>

                    {sub.description && (
                      <p style={{ margin: "0 0 15px" }}>{sub.description}</p>
                    )}

                    {sub.documents
                      ?.sort((a, b) => a.order - b.order)
                      .map((doc) => (
                        <DocumentView
                          key={doc.id}
                          name={doc.title}
                          description={doc.description}
                          date={doc.createdAt}
                          url={
                            doc.path
                              ? `${process.env.NEXT_PUBLIC_API_URL}/${doc.path}`
                              : undefined
                          }
                        />
                      ))}
                  </div>
                ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
