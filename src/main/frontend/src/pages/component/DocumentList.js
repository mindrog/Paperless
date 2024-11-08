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
                                value = {
                                    'submitted': '상신',
                                    'approved': '승인',
                                    'pending': '대기 중',
                                    'canceled': '반려'
                                }[value] || value;
                            }

                            // 날짜 포맷
                            if (column.key === 'submission_date' && value) {
                                const date = new Date(value);
                                value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                            }

                            return (
                                <td key={`${column.key}-${doc.repo_no || index}`} className={styles.ellipsis} title={value || ''}>
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
