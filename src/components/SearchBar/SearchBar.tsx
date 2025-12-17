"use client";

import styles from "@/components/SearchBar/SearchBar.module.scss";

import { useEffect, useRef, useState, useCallback } from "react";

import api from "@/app/api/api";
import { Document } from "@/types/document";
import { SearchBarProps } from "@/types/searchFilters";

export default function SearchBar({ onResults }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchFilteredDocuments = useCallback(async () => {
    try {
      const params: Record<string, string> = {};

      if (query.trim()) params.title = query.trim();

      const { data } = await api.get<Document[]>("/documents/search", { params });

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
    const hasFilters = query.trim();

    if (!hasFilters) {
      onResults([], { query: "" });
      return;
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      fetchFilteredDocuments();
    }, 400);

    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [query, fetchFilteredDocuments, onResults]);

  return (
    <div className={styles.search_wrapper}>
        <input
          type="text"
          placeholder="Найти документ по названию"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.search}
        />
    </div>
  );
}