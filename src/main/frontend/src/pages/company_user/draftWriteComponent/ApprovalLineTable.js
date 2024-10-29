import React from 'react';
import { Table, Button } from 'react-bootstrap';
import styles from '../../../styles/company/company_draft_write_work.module.css';

const ApprovalLineTable = ({ handleApprLineModal }) => (
  <Table bordered size="sm" className={styles.apprLineBox}>
    <tbody className={styles.apprLineTbody}>
      <tr className={styles.apprLinedocTr}>
        <td className={styles.docKey}>상신</td>
        <td className={styles.docKey}>결재</td>
      </tr>
      <tr>
        <td className={styles.docKey}>배수지</td>
        <td>
          <Button className={styles.apprLineBtn} onClick={handleApprLineModal}>결재선</Button>
        </td>
      </tr>
      <tr><td className={styles.docValue_date}></td><td>-</td></tr>
    </tbody>
  </Table>
);

export default ApprovalLineTable;
