"use client";

import styles from "@/components/SearchBar/SearchBar.module.scss";
import { Document } from "@/types/document";
import { SearchBarProps } from "@/types/searchFilters";
import api from "@/services/api";
import { useEffect, useRef, useState, useCallback } from "react";

export default function SearchBar({ onResults }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchFilteredDocuments = useCallback(async () => {
    try {
      const params: Record<string, string> = {};

      if (query.trim()) params.title = query.trim();
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;

      const { data } = await api.get<Document[]>("/documents/search", {params});

      onResults(data, { query, dateFrom, dateTo });
    } catch (err) {
      console.error("❌ Ошибка при фильтрации:", err);
    }
  }, [query, dateFrom, dateTo, onResults]);

  useEffect(() => {
    const hasFilters = query.trim() || dateFrom || dateTo;

    if (!hasFilters) {
      onResults([], { query: "", dateFrom: "", dateTo: "" });
      return;
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      fetchFilteredDocuments();
    }, 400);

    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [query, dateFrom, dateTo, fetchFilteredDocuments, onResults]);

  return (
    <div className={styles.search_wrapper}>
      <div>
        <input
          placeholder="Искать по названию"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.search}
        />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className={styles.filter}
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className={styles.filter}
        />
      </div>
    </div>
  );
}
