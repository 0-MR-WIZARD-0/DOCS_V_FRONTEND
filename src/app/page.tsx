"use client";

import api from "@/app/api/api";

import { Section } from "@/types/section";
import { Document } from "@/types/document";
import { SearchFilters } from "@/types/searchFilters";

import { useEffect, useState, useCallback, useRef } from "react";

import SearchBar from "@/components/SearchBar/SearchBar";
import DocumentView from "@/components/DocumentView/DocumentView";

import styles from "@/app/main.module.scss"

export default function Home() {
  const [sections, setSections] = useState<Section[]>([]);
  const [searchedDocs, setSearchedDocs] = useState<Document[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const isLoadingRef = useRef(false);

  const loadStructure = useCallback(async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    try {
      const res = await api.get("/sections");
      setSections(
        Array.isArray(res.data)
          ? [...res.data].sort((a, b) => a.order - b.order)
          : []
      );
    } catch (e) {
      console.error("Failed to load sections:", e);
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadStructure();
  }, [loadStructure]);

  const handleSearchResults = useCallback(
    (docs: Document[], filters: SearchFilters) => {
      const { query } = filters;
      const hasFilters = query.trim();

      if (!hasFilters) {
        setIsSearching(false);
        loadStructure();
        return;
      }

      setIsSearching(true);
      setSearchedDocs(docs);
    },
    [loadStructure]
  );

  return (
    <main>
      <SearchBar onResults={handleSearchResults} />
      {isSearching ? (
        searchedDocs.length ? (
          searchedDocs.map((doc) => (
            <DocumentView
              key={doc.id}
              name={doc.title}
              description={doc.description}
              url={
                doc.path
                  ? `${process.env.NEXT_PUBLIC_API_URL}/${doc.path}`
                  : undefined
              }
            />
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>Ничего не найдено</p>
        )
      ) : sections.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Данные отсутствуют
        </p>
       ) : (
        <div className={styles.wrapper}>
          {sections.map((section) => (
            <div key={section.id} className={styles.wrapper_item}>
              <h2>{section.name}</h2>
              {(section.description ? <p>{section.description}</p> : "")}
              {section.documents
                ?.sort((a, b) => a.order - b.order)
                .map((doc) => (
                  <DocumentView
                    key={doc.id}
                    name={doc.title}
                    description={doc.description}
                    url={
                      doc.path
                        ? `${process.env.NEXT_PUBLIC_API_URL}/${doc.path}`
                        : undefined
                    }
                  />
                ))}
              {[...section.subsections!]
                .sort((a, b) => a.order - b.order)
                .map((sub) => (
                  <div key={sub.id} className={styles.wrapper_sub_item}>
                    <h3>{sub.name}</h3>
                    {(sub.description ? <p>{sub.description}</p> : "")}
                    {[...sub.documents]
                      .sort((a, b) => a.order - b.order)
                      .map((doc) => (
                        <DocumentView
                          key={doc.id}
                          name={doc.title}
                          description={doc.description}
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
        </div>
      )}
    </main>
  );
}
