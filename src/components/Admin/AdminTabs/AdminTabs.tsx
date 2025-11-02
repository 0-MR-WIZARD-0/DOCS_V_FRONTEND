'use client'

import { useState } from "react";
import UploadForm from "../UploadForm/UploadForm";
import DocumentsList from "../DocumentsList/DocumentsList";

export default function AdminTabs() {
  const [activeTab, setActiveTab] = useState<'upload' | 'list'>('upload');
  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
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
