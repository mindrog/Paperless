import React, { useState } from 'react';
import styles from '../../styles/company/company_draft_write_work.module.css';

const WorkReportForm = () => {
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
      <form onSubmit={handleSubmit}>
        <table className={styles.draftTable}>
          <tbody>
            <tr>
              <th>업무 보고 제목</th>
              <td>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  required
                  className={styles.inputField}
                />
              </td>
            </tr>
            <tr>
              <th>보고자</th>
              <td>
                <input
                  type="text"
                  value={reporter}
                  onChange={(e) => setReporter(e.target.value)}
                  required
                  className={styles.inputField}
                />
              </td>
            </tr>
            <tr>
              <th>보고 날짜</th>
              <td>
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  required
                  className={styles.inputField}
                />
              </td>
            </tr>
            <tr>
              <th>소속 부서</th>
              <td>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className={styles.selectField}
                >
                  <option value="">소속 부서를 선택하세요</option>
                  <option value="saaS">SaaS 운영팀</option>
                  <option value="serviceDevelopment">서비스 개발팀</option>
                  <option value="platform">플랫폼팀</option>
                  <option value="contentPlanning">콘텐츠 기획팀</option>
                  <option value="strategicPlanning">전략 기획팀</option>
                  <option value="managementSupport">경영 지원팀</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>업무 내용</th>
              <td>
                <textarea
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  required
                  className={styles.textareaField}
                />
              </td>
            </tr>
            <tr>
              <th>향후 계획</th>
              <td>
                <textarea
                  value={nextPlan}
                  onChange={(e) => setNextPlan(e.target.value)}
                  className={styles.textareaField}
                />
              </td>
            </tr>
            <tr>
              <th>결재선 지정</th>
              <td>
                {approvals.map((approval, index) => (
                  <div key={index} className={styles.approvalRow}>
                    <input
                      type="text"
                      placeholder="결재자 이름"
                      value={approval.name}
                      onChange={(e) =>
                        setApprovals(
                          approvals.map((appr, idx) =>
                            idx === index ? { ...appr, name: e.target.value } : appr
                          )
                        )
                      }
                      className={styles.inputField}
                      required
                    />
                    <input
                      type="text"
                      placeholder="결재자 직급"
                      value={approval.position}
                      onChange={(e) =>
                        setApprovals(
                          approvals.map((appr, idx) =>
                            idx === index ? { ...appr, position: e.target.value } : appr
                          )
                        )
                      }
                      className={styles.inputField}
                      required
                    />
                    {approvals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveApproval(index)}
                        className={styles.removeButton}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={handleAddApproval} className={styles.addButton}>
                  결재선 추가
                </button>
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

export default WorkReportForm;
