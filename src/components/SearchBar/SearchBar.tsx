"use client";

import styles from "@/components/SearchBar/SearchBar.module.scss";

import { useEffect, useRef, useState, useCallback } from "react";

import api from "@/app/api/api";
import { Document } from "@/types/document";
import { SearchBarProps } from "@/types/searchFilters";

export default function SearchBar({ onResults }: SearchBarProps) {

  const [query, setQuery] = useState("");
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchFilteredDocuments = useCallback(async () => {

    if (!query.trim()) return;

    abortRef?.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { data } = await api.get<Document[]>("/documents/search", { 
        params: {title: query.trim()},
        signal: controller.signal
      });
      onResults(data, { query });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("❌ Error while filtering documents:", err.message);
      } else {
        console.error("❌ Unknown error while filtering documents:", err);
      }
    }
  }, [query, onResults]);

  useEffect(() => {
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(fetchFilteredDocuments, 400);

    return () => clearTimeout(typingTimeout.current!);
  }, [fetchFilteredDocuments]);

  return (
    <div className={styles.search_wrapper}>
        <input
          type="text"
          placeholder="Найти документ по названию"
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v) 
            if (!v.trim()) onResults([], {query: ""})
          }}
          className={styles.search}
        />
    </div>
  );
}