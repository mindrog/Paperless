import React from 'react';
import { Form, Table } from 'react-bootstrap';
import styles from '../../../styles/company/company_draft_write_work.module.css';

const DraftTitleInput = ({ reportTitle = '', setReportTitle, formErrors = {} }) => (
  <Table bordered className={styles.docTitleHeader}>
    <thead>
      <tr className={styles.docTitleBox}>
        <th className={styles.docTitle}>기안 제목</th>
        <th colSpan={3}>
          <Form.Control
            type="text"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className={`${styles.inputForm} ${formErrors.reportTitle ? styles.errorInput : ''}`}
            placeholder="기안 제목을 입력하세요"
          />
          {formErrors.reportTitle && <span className={styles.errorMessage}>기안 제목을 입력해주세요</span>}
        </th>
      </tr>
    </thead>
  </Table>
);

export default DraftTitleInput;
