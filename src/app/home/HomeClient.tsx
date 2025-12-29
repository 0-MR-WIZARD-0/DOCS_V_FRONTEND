"use client";

import { useCallback, useState } from "react";

import { Section } from "@/types/section";
import { Document } from "@/types/document";
import { SearchFilters } from "@/types/searchFilters";

import SearchBar from "@/components/SearchBar/SearchBar";
import DocumentView from "@/components/DocumentView/DocumentView";

import styles from "@/app/home/main.module.scss";

const API_URL = process.env.INTERNAL_API_URL!;

interface Props {
  sections: Section[];
}

export default function HomeClient({ sections }: Props) {
  const [searchedDocs, setSearchedDocs] = useState<Document[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchResults = useCallback(
    (docs: Document[], filters: SearchFilters) => {
      const query = filters.query.trim();

      if (!query) {
        setIsSearching(false);
        setSearchedDocs([]);
        return;
      }

      setIsSearching(true);
      setSearchedDocs(docs);
    },
    []
  );

  const renderDocuments = (docs?: Document[]) => {
    if (!docs || docs.length === 0) return null;

    return [...docs]
      .sort((a, b) => a.order - b.order)
      .map((doc) => (
        <DocumentView
          key={doc.id}
          name={doc.title}
          description={doc.description}
          url={doc.path ? `${API_URL}/${doc.path}` : undefined}
        />
      ));
  };

  return (
    <main>
      <SearchBar onResults={handleSearchResults} />
      {isSearching ? (
        searchedDocs.length > 0 ? (
          renderDocuments(searchedDocs)
        ) : (
          <p style={{ textAlign: "center", marginTop: 20 }}>
            Ничего не найдено
          </p>
        )
      ) : sections.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: 20 }}>
          Данные отсутствуют
        </p>
      ) : (
        <div className={styles.wrapper}>
          {sections.map((section) => (
            <div key={section.id} className={styles.wrapper_item}>
              <h2>{section.name}</h2>

              {section.description && <p>{section.description}</p>}

              {renderDocuments(section.documents)}

              {section.subsections &&
                section.subsections.length > 0 &&
                section.subsections
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((sub) => (
                    <div
                      key={sub.id}
                      className={styles.wrapper_sub_item}
                    >
                      <h3>{sub.name}</h3>

                      {sub.description && <p>{sub.description}</p>}

                      {renderDocuments(sub.documents)}
                    </div>
                  ))}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}