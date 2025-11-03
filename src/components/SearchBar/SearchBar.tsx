'use client'

import styles from "@/components/SearchBar/SearchBar.module.scss"

const SearchBar = () => {
  return (
    <div className={styles.search_wrapper}>
      <div>
        <input placeholder="Искать по названию" className={styles.search}/>
        <div>
          <input type="date" className={styles.filter}/>
          <input type="date" className={styles.filter}/>
        </div>
      </div>
    </div>
  )
}

export default SearchBar