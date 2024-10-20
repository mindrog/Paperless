// 근태 기안 작성

import React, { useState } from 'react';
import styles from '../../styles/company/company_draft_write_work.module.css';

const CompanyUserDraftWriteAtten = () => {
  const [reporter, setReporter] = useState('');
  const [department, setDepartment] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [docNo, setDocNo] = useState('');
  const [vacationType, setVacationType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [vacationReason, setVacationReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      reporter,
      department,
      reportDate,
      docNo,
      vacationType,
      startDate,
      endDate,
      isHalfDay,
      vacationReason,
    };
    console.log('Form Data: ', formData);
  };

  return (
    <div className={styles.container}>
      <h1>연차 신청서</h1>
      <form onSubmit={handleSubmit}>
        <table className={styles.draftTable}>
          <tbody>
            <tr>
              <td colSpan="2" style={{ fontSize: '22px', fontWeight: 'bold', textAlign: 'center', height: '90px' }}>
                연차 신청서
              </td>
            </tr>
            <tr>
              <td style={{ width: '300px', padding: '3px', textAlign: 'center', fontWeight: 'bold', background: '#ddd' }}>
                기안자
              </td>
              <td>
                <input
                  type="text"
                  value={reporter}
                  onChange={(e) => setReporter(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '3px', textAlign: 'center', fontWeight: 'bold', background: '#ddd' }}>기안부서</td>
              <td>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '3px', textAlign: 'center', fontWeight: 'bold', background: '#ddd' }}>기안일</td>
              <td>
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '3px', textAlign: 'center', fontWeight: 'bold', background: '#ddd' }}>문서번호</td>
              <td>
                <input
                  type="text"
                  value={docNo}
                  onChange={(e) => setDocNo(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '3px', textAlign: 'center', fontWeight: 'bold', background: '#ddd' }}>휴가 종류</td>
              <td>
                <select
                  value={vacationType}
                  onChange={(e) => setVacationType(e.target.value)}
                  className={styles.selectField}
                  required
                >
                  <option value="">휴가 종류 선택</option>
                  <option value="annual">연차</option>
                  <option value="sick">병가</option>
                  <option value="maternity">출산 휴가</option>
                </select>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '3px', textAlign: 'center', fontWeight: 'bold', background: '#ddd' }}>기간 및 일시</td>
              <td>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={styles.inputField}
                  required
                />
                ~
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '3px', textAlign: 'center', fontWeight: 'bold', background: '#ddd' }}>반차 여부</td>
              <td>
                <input
                  type="checkbox"
                  checked={isHalfDay}
                  onChange={(e) => setIsHalfDay(e.target.checked)}
                  className={styles.checkboxField}
                />
                반차 사용
              </td>
            </tr>
            <tr>
              <td style={{ padding: '3px', textAlign: 'center', fontWeight: 'bold', background: '#ddd' }}>휴가 사유</td>
              <td>
                <textarea
                  value={vacationReason}
                  onChange={(e) => setVacationReason(e.target.value)}
                  className={styles.textareaField}
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" className={styles.submitButton}>
          제출
        </button>
      </form>
    </div>
  );
};

export default CompanyUserDraftWriteAtten