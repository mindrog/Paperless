// Pagination.js
import React from 'react';
import styles from '../../styles/component/Pagination.module.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.pagination}>
      <button
        className={styles['page-button']}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        이전
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          className={`${styles['page-button']} ${currentPage === number ? styles.active : ''}`}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}
      <button
        className={styles['page-button']}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </div>
  );
}

export default Pagination;
