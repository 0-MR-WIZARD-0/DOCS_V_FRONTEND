'use client'

import styles from "@/components/Admin/AdminTabs/AdminTabs.module.scss"
import { useState } from "react";
import UploadForm from "../UploadForm/UploadForm";
import DocumentsList from "../DocumentsList/DocumentsList";

export default function AdminTabs() {

  const [activeTab, setActiveTab] = useState<'upload' | 'list'>('upload');

  return (
    <div className={styles.tabs_wrapper}>
      <div>
        <button onClick={() => setActiveTab('upload')} style={{ marginRight: 10 }}>
          Загрузка документов
        </button>
        <button onClick={() => setActiveTab('list')}>Список документов</button>
      </div>
      {activeTab === 'upload' && <UploadForm />}
      {activeTab === 'list' && <DocumentsList />}
    </div>
  );
}
