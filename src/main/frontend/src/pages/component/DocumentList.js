// DocumentList.js

import React from 'react';
import styles from '../../styles/component/DocumentList.module.css';

function DocumentList({ docs = [], onRowClick, columns = [] }) {
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
                    <tr key={doc.repo_no || index} onClick={() => onRowClick(doc.repo_no)}>
                        {columns.map((column) => {
                            const value = column.key === 'no' ? index + 1 : doc[column.key];
                            return (
                                <td key={`${column.key}-${doc.repo_no || index}`} className={styles.ellipsis} title={value}>
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
