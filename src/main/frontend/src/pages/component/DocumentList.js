// DocumentList.js
import React from 'react';
import styles from '../../styles/component/DocumentList.module.css';

function DocumentList({ docs = [], onRowClick, columns = [] }) {
  console.log('columns:', columns);
  console.log('docs:', docs);
  return (
    <table className={styles['doc-table']}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} style={{ width: column.width }}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {docs.map((doc, index) => (
          <tr key={doc.id} onClick={() => onRowClick(doc)}>
            {columns.map((column) => {
              let value;
              if (column.key === 'no') {
                value = index + 1;
              } else {
                value = doc[column.key];
              }
              return (
                <td key={column.key} className={styles.ellipsis} title={value}>
                  {value}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DocumentList;
