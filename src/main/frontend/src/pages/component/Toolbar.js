// Toolbar.js
import React from 'react';
import styles from '../../styles/component/Toolbar.module.css';

function Toolbar({ sortOption, onSortChange, searchTerm, onSearchTermChange, onSearch }) {
  return (
    <div className={styles.toolbar}>
      <div className={styles['left-tools']}>
        <select value={sortOption} onChange={onSortChange} className={styles['sort-select']}>
          <option value="dateDesc">날짜 내림차순</option>
          <option value="dateAsc">날짜 오름차순</option>
          <option value="titleAsc">제목 오름차순</option>
          <option value="titleDesc">제목 내림차순</option>
        </select>
      </div>
      <div className={styles['search-bar']}>
        <input
          type="text"
          placeholder="검색"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className={styles['search-input']}
        />
        <button className={styles['search-button']} onClick={onSearch}>
          검색
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
