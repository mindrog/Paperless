import React from 'react';
import TextEditor from '../../../ckEditor/TextEditor';
import styles from '../../../styles/company/company_draft_write_work.module.css';

const ContentEditor = ({ reportContent = '', setReportContent, formErrors = {} }) => (
  <div>
    <TextEditor initialData={reportContent} setData={setReportContent} />
    {formErrors.reportContent && <span className={styles.errorMessage}>내용을 입력해주세요</span>}
  </div>
);


export default ContentEditor;

