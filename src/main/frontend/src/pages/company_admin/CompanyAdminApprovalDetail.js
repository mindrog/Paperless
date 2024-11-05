import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import styles from '../../styles/company/company_draft_write_work.module.css';

const CompanyAdminApprovalDetail = () => {
  const location = useLocation();
  const {
    reportId,
    reportTitle = '업무 보고서',
    reportContent = '상세 보고 내용입니다.',
    reporter = '홍길동',
    department = 'IT팀',
    reportDate = '2024-10-16',
    repoStartTime = '2024-10-19',
    repoEndTime = '2024-10-31',
    selectedApprovers = [
      { emp_name: '박수진', posi_name: '부장', approvalType: '결재' },
      { emp_name: '이민수', posi_name: '차장', approvalType: '합의' }
    ],
    selectedReferences = [{ emp_name: '김철수' }],
    selectedReceivers = [{ emp_name: '이영희' }],
    files = ['example.pdf', 'summary.docx']
  } = location.state || {}; // 전달된 데이터를 추출

  useEffect(() => {
    if (reportId) {
      console.log("불러올 reportId:", reportId);
    }
  }, [reportId]);

  return (
    <div className="container">
      <div className={styles.formHeader}>
        <h2 className={styles.pageTitle}>결재 문서</h2>
      </div>

      <div className={styles.formContent}>
        <div className={styles.apprSumbitBtnBox}>
          <Button className={styles.cancelBtn}>상신 취소</Button>
          <Button className={styles.approveBtn}>회신</Button>
        </div>

        <Table bordered className={styles.mainTable}>
          <tbody>
            <tr>
              <td className={styles.labelCellTitle}>제&nbsp;&nbsp;&nbsp;&nbsp;목</td>
              <td className={styles.valueCell} colSpan="3">{reportTitle}</td>
            </tr>
          </tbody>
        </Table>

        <div className={styles.docInfoSection}>
          <Table bordered size="sm" className={styles.innerTable}>
            <tbody>
              <tr>
                <td className={styles.labelCell}>문서번호</td>
                <td className={styles.valueCell}>{reportId}</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>부&nbsp;&nbsp;서</td>
                <td className={styles.valueCell}>{department}</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>기&nbsp;안&nbsp;일</td>
                <td className={styles.valueCell}>{reportDate}</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>기 안 자</td>
                <td className={styles.valueCell}>{reporter}</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>시행일자</td>
                <td className={styles.valueCell}>{repoStartTime}</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>마감일자</td>
                <td className={styles.valueCell}>{repoEndTime}</td>
              </tr>
            </tbody>
          </Table>

          <Table bordered size="sm" className={styles.innerApprTable}>
            <tbody>
              <tr>
                <td className={styles.labelCell}>상신</td>
                {selectedApprovers.map((_, index) => (
                  <td key={index} className={styles.valueCell}>결재</td>
                ))}
              </tr>
              <tr>
                <td className={styles.valueCell}>{reporter}</td>
                {selectedApprovers.map((approver, index) => (
                  <td key={index} className={styles.valueCell}>
                    <div>
                      <span>{approver.posi_name}</span>
                      {approver.emp_name} ({approver.approvalType})
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
        </div>

        <Table bordered className={styles.secondaryTable}>
          <tbody>
            <tr>
              <td className={styles.labelCell}>참&nbsp;&nbsp;&nbsp;조</td>
              <td className={styles.valueCell}>
                {selectedReferences.map((ref, index) => (
                  <span key={index}>{ref.emp_name}{index < selectedReferences.length - 1 && ', '}</span>
                ))}
              </td>
              <td className={styles.labelCell}>수&nbsp;&nbsp;&nbsp;신</td>
              <td className={styles.valueCell}>
                {selectedReceivers.map((recv, index) => (
                  <span key={index}>{recv.emp_name}{index < selectedReceivers.length - 1 && ', '}</span>
                ))}
              </td>
            </tr>
            <tr>
              <td colSpan="4" className={styles.detailsTitle}>상세 내용</td>
            </tr>
            <tr>
              <td colSpan="4" className={styles.valueCellContent}>
                {reportContent}
              </td>
            </tr>
          </tbody>
        </Table>

        <Table bordered>
          <tbody>
            <tr>
              <td colSpan="4" className={styles.valueCellFile}>첨부 파일</td>
            </tr>
            <tr>
              <td colSpan="4" className={styles.valueCellFile}>
                {files.length > 0 ? (
                  <ul>
                    {files.map((file, index) => (
                      <li key={index} className={styles.fileList}>📄 {file}</li>
                    ))}
                  </ul>
                ) : (
                  '첨부된 파일이 없습니다.'
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default CompanyAdminApprovalDetail;
