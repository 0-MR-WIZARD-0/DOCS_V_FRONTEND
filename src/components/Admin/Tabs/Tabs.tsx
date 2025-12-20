'use client'

import styles from "@/components/Admin/Tabs/Tabs.module.scss"

import { useState } from "react";

import ContentList from "../ContentLists/ContentList";
import UploadSection from "../UploadForms/UploadSection/UploadSection";
import UploadDocument from "../UploadForms/UploadDocument/UploadDocument";

export default function AdminTabs() {

  const [activeTab, setActiveTab] = useState<'uploadSection' | 'listSections' | 'uploadDocument'>('uploadSection');

  return (
    <nav className={styles.tabs_wrapper}>
      <div>
        <button onClick={() => setActiveTab('uploadSection')}>Создать раздел / подраздел</button>
        <button onClick={() => setActiveTab('uploadDocument')}>Создать документ</button>
        <button onClick={() => setActiveTab('listSections')}>Список разделов / подразделов / документов</button>
      </div>
      {activeTab === 'uploadSection' && <UploadSection />}
      {activeTab === 'listSections' && <ContentList />}
      {activeTab === 'uploadDocument' && <UploadDocument />}
    </nav>
  );
}
