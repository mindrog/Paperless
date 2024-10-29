import React from 'react';
import { Table, Form } from 'react-bootstrap';
import styles from '../../../styles/company/company_draft_write_work.module.css';

const DraftDocInfoTable = ({ department, reporter, reportDate, repoStartTime }) => (
  <Table bordered size="sm" className={styles.docInfo}>
    <tbody>
      <tr><th className={styles.docKey}>문서번호</th><td className={styles.docValue}>-</td></tr>
      <tr><td className={styles.docKey}>본 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 부</td><td className={styles.docValue}>{department || 'Mark'}</td></tr>
      <tr><td className={styles.docKey}>부 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 서</td><td className={styles.docValue}>{reporter || 'Jacob'}</td></tr>
      <tr><td className={styles.docKey}>기 &nbsp;안 &nbsp;일</td><td className={styles.docValue}>{reportDate || ''}</td></tr>
      <tr><td className={styles.docKey}>기 &nbsp;안 &nbsp;자</td><td className={styles.docValue}>배수지</td></tr>
      <tr><td className={styles.docKey}>시행&nbsp;일자</td>
          <td className={styles.docValue}>
            <Form.Control
                  type="date"
                  value={repoStartTime}
                  className={styles.inputFormDate}
            />  
          </td>
      </tr>
      <tr><td className={styles.docKey}>마감&nbsp;일자</td>
          <td className={styles.docValue}>
            <Form.Control
                  type="date"
                  value={repoStartTime}
                  className={styles.inputFormDate}
            />  
          </td>
      </tr>
      <tr><td className={styles.docKey}>결재 상태</td><td className={styles.docValue}>신청</td></tr>
    </tbody>
  </Table>
);

export default DraftDocInfoTable;
