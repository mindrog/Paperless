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
                            let value = column.key === 'no' ? index + 1 : doc[column.key];

                             // 상태 변환
                            if (column.key === 'reportStatus' && value) {
                                if (value === 'submitted') {
                                    value = '상신';
                                } else if (value === 'approved') {
                                    value = '승인';
                                } else if (value === 'pending') {
                                    value = '대기 중';
                                } else if (value === 'canceled') {
                                    value = '반려';
                                }
                            }

                            // 날짜 포맷
                            if (column.key === 'submission_date' && value) {
                                const date = new Date(value);
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                value = `${year}-${month}-${day}`; // YYYY-MM-DD 형식
                            }
                            
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
