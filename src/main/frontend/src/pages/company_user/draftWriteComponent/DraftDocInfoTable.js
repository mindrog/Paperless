import React from 'react';
import { Table, Form } from 'react-bootstrap';
import styles from '../../../styles/company/company_draft_write_work.module.css';

const DraftDocInfoTable = ({ 
  department, 
  team, 
  reporter, 
  reportDate, 
  repoStartTime, 
  repoEndTime, 
  reportStatus, 
  onStartDateChange, 
  onEndDateChange 
}) => (
  <Table bordered size="sm" className={styles.docInfo}>
    <tbody>
      <tr><th className={styles.docKey}>문서번호</th><td className={styles.docValue}>-</td></tr>
      <tr><td className={styles.docKey}>부 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 서</td><td className={styles.docValue}>{department}</td></tr>
      <tr><td className={styles.docKey}>소 &nbsp;속 &nbsp;팀</td><td className={styles.docValue}>{team}</td></tr>
      <tr><td className={styles.docKey}>기 &nbsp;안 &nbsp;일</td><td className={styles.docValue}>{reportDate}</td></tr>
      <tr><td className={styles.docKey}>기 &nbsp;안 &nbsp;자</td><td className={styles.docValue}>{reporter}</td></tr>
      <tr>
        <td className={styles.docKey}>시행&nbsp;일자</td>
        <td className={styles.docValue}>
          <Form.Control
            type="date"
            value={repoStartTime}
            className={styles.inputFormDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />  
        </td>
      </tr>
      <tr>
        <td className={styles.docKey}>마감&nbsp;일자</td>
        <td className={styles.docValue}>
          <Form.Control
            type="date"
            value={repoEndTime}
            className={styles.inputFormDate}
            onChange={(e) => onEndDateChange(e.target.value)} 
          />  
        </td>
      </tr>
      <tr><td className={styles.docKey}>결재 상태</td><td className={styles.docValue}>{reportStatus || '신청'}</td></tr>
    </tbody>
  </Table>
);

export default DraftDocInfoTable;
