import React from 'react';
import styles from '../../styles/component/DocumentList.module.css';

function DocumentList({ docs, onRowClick }) {
  return (
    <table className={styles['doc-table']}>
      <thead>
        <tr>
          <th style={{ width: '5%' }}>No</th>
          <th style={{ width: '10%' }}>문서 번호</th>
          <th style={{ width: '10%' }}>문서 양식</th>
          <th style={{ width: '30%' }}>문서 제목</th>
          <th style={{ width: '15%' }}>기안자</th>
          <th style={{ width: '20%' }}>기안일</th>
          <th style={{ width: '10%' }}>결재 상태</th>
        </tr>
      </thead>
      <tbody>
        {docs.map((doc, index) => (
          <tr key={doc.id} onClick={() => onRowClick(doc)}>
            <td>{index + 1}</td>
            <td className={styles.ellipsis}>{doc.docNumber}</td>
            <td className={styles.ellipsis}>{doc.docType}</td>
            <td className={styles.ellipsis} title={doc.title}>{doc.title}</td>
            <td className={styles.ellipsis}>{doc.drafter}</td>
            <td className={styles.ellipsis}>{doc.draftDate}</td>
            <td className={styles.ellipsis}>{doc.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DocumentList;
