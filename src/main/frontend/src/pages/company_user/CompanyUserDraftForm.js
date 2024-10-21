// 기안 미리보기

import React, { useState } from 'react';
import styles from '../../styles/company/company_draft_write_work.module.css';

const CompanyUserDraftForm = () => {
  const [reportTitle, setReportTitle] = useState('');
  const [reporter, setReporter] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [department, setDepartment] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [nextPlan, setNextPlan] = useState('');
  const [approvals, setApprovals] = useState([{ name: '', position: '' }]);

  const handleAddApproval = () => {
    setApprovals([...approvals, { name: '', position: '' }]);
  };

  const handleRemoveApproval = (index) => {
    const updatedApprovals = approvals.filter((_, idx) => idx !== index);
    setApprovals(updatedApprovals);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      reportTitle,
      reporter,
      reportDate,
      department,
      reportContent,
      nextPlan,
      approvals
    };
    console.log('Form Data: ', formData);
  };

  return (
    <div className={styles.container}>
      <h1>업무 보고 기안</h1>
      <table className={styles.mainTable} style={{ width: '800px', marginTop: '1px', borderCollapse: 'collapse' }}>
        <colgroup>
          <col width="310" />
          <col width="490" />
        </colgroup>
        <tbody>
          <tr>
            <td colSpan="2" className={styles.titleCell}>
              기&nbsp;&nbsp;안&nbsp;&nbsp;용&nbsp;&nbsp;지
            </td>
          </tr>
          <tr>
            <td>
              <table className={styles.innerTable}>
                <colgroup>
                  <col width="90" />
                  <col width="120" />
                </colgroup>
                <tbody>
                  <tr>
                    <td className={styles.labelCell}>문서번호</td>
                    <td className={styles.valueCell}>문서번호</td>
                  </tr>
                  <tr>
                    <td className={styles.labelCell}>부&nbsp;&nbsp;&nbsp;서</td>
                    <td className={styles.valueCell}>기안부서</td>
                  </tr>
                  <tr>
                    <td className={styles.labelCell}>기&nbsp;안&nbsp;일</td>
                    <td className={styles.valueCell}>기안일</td>
                  </tr>
                  <tr>
                    <td className={styles.labelCell}>기 안 자</td>
                    <td className={styles.valueCell}>기안자</td>
                  </tr>
                  <tr>
                    <td className={styles.labelCell}>시행일자</td>
                    <td className={styles.valueCell}>
                      <input className="ipt_editor ipt_editor_date" type="text" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td className={styles.approvalLineCell}>
              [결재선]
              <table>
                <tr>결재</tr>
                <tr>(성명)</tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <table className={styles.secondaryTable} style={{ width: '800px', marginTop: '10px', height: '385px', borderCollapse: 'collapse' }}>
        <colgroup>
          <col width="140" />
          <col width="660" />
        </colgroup>
        <tbody>
          <tr>
            <td className={styles.labelCell}>참&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;조</td>
            <td className={styles.valueCell}>참조자</td>
          </tr>
          <tr>
            <td className={styles.labelCell}>제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;목</td>
            <td className={styles.valueCell}>
              <input className="ipt_editor" type="text" />
            </td>
          </tr>
          <tr>
            <td colSpan="2" className={styles.detailsTitle}>상&nbsp;&nbsp;세&nbsp;&nbsp;내&nbsp;&nbsp;용</td>
          </tr>
          <tr>
            <td colSpan="2" className={styles.valueCell}>에디터(본문)</td>
          </tr>
        </tbody>
      </table>
    </div>
  )}

export default CompanyUserDraftForm