import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import styles from '../../styles/company/company_draft_appr_detail_work.module.css';
import moment from 'moment';

const CompanyUserDraftDetailWork = () => {
  const { reportId } = useParams();
  const [reportData, setReportData] = useState(null);

  const location = useLocation();
  const [reportStatus, setReportStatus] = useState('');
  const [repoStartTime, setRepoStartTime] = useState('');
  const [repoEndTime, setRepoEndTime] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (reportId) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");

          const response = await fetch(`/api/report/${reportId}`, {
            method: 'GET',
            headers: {
              'Authorization': `${token}`,
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setReportData(data);
          
          console.log("response data:", JSON.stringify(data, null, 2))
        } catch (error) {
          console.error('Error fetching report data:', error);
        }
      };
      fetchData();
    }
  }, [reportId]);

  const apprIsRead = reportData?.appr_is_read; // 예: reportData에 appr_is_read 값이 포함된 경우

  return (
    <div className="container">
      <div className={styles.formHeader}>
        <h2 className={styles.pageTitle}>기안 상세보기</h2>
      </div>

      <div className={styles.formContent}>
        <div className={styles.btnBox}>
          <Button
            className={styles.submitCancelBtn}
          >
            목록으로
          </Button>
          <div>
            <Button
              className={styles.submitCancelBtn}
              disabled={apprIsRead === 1} // appr_is_read이 1이면 비활성화
            >
              상신 취소
            </Button>
            <Button
              className={styles.retrieveBtn}
              disabled={apprIsRead === 0} // appr_is_read이 0이면 비활성화
            >
              회수
            </Button>
          </div>
        </div>

        <Table bordered className={styles.mainTable}>
          <tbody>
            <tr>
              <td className={styles.labelCellTitle}>제&nbsp;&nbsp;&nbsp;&nbsp;목</td>
              <td className={styles.valueCell} colSpan="3">{reportData?.repo_title || ''}</td>
            </tr>
          </tbody>
        </Table>

        <div className={styles.docInfoSection}>
          <Table bordered size="sm" className={styles.innerTable}>
            <tbody>
              <tr>
                <td className={styles.labelCelldoc}>문서번호</td>
                <td className={styles.valueCell}>{reportData?.repo_code || ''}</td>
              </tr>
              <tr>
                <td className={styles.labelCelldoc}>부&nbsp;&nbsp;&nbsp;서</td>
                <td className={styles.valueCell}>{reportData?.department || ''}</td>
              </tr>
              <tr>
                <td className={styles.labelCelldoc}>기&nbsp;안&nbsp;일</td>
                <td className={styles.valueCell}>
                  {reportData?.draft_date ? moment(reportData.draft_date).format("YYYY-MM-DD") : ''}
                </td>
              </tr>
              <tr>
                <td className={styles.labelCelldoc}>기 안 자</td>
                <td className={styles.valueCell}>{reportData?.writer || ''}</td>
              </tr>
              <tr>
                <td className={styles.labelCelldoc}>시행일자</td>
                <td className={styles.valueCell}>{reportData?.repo_start_time || ''}</td>
              </tr>
              <tr>
                <td className={styles.labelCelldoc}>마감일자</td>
                <td className={styles.valueCell}>{reportData?.repo_end_time || ''}</td>
              </tr>
            </tbody>
          </Table>

          <Table bordered size="sm" className={styles.innerApprTable}>
            <tbody className="apprLineTbody">
              <tr className="apprLinedocTr">
                <td className={styles.valueCellAppr}>상신</td>
                {(reportData?.approver || []).map((_, index) => (
                  <td key={index} className={styles.valueCellAppr}>결재</td>
                ))}
              </tr>

              <tr>
                <td className={styles.docValueAppr}>{reportData?.writer || ''}</td>
                {(reportData?.approver || []).map((approver, index) => (
                  <td key={index} className={styles.docValueAppr}>
                    <div style={{ position: 'relative' }}>
                      <div className="apprTypePosi">{approver.posi_name}</div>
                      {approver.emp_name}
                      <div className="apprType">{approver.approvalType && `(${approver.approvalType})`}</div>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className={styles.docValue_date}>
                  {reportData?.draft_date ? moment(reportData.draft_date).format("YYYY-MM-DD") : ''}
                </td>
                {(reportData?.approver || []).map((_, index) => (
                  <td key={index} className={styles.docValue_date}></td>
                ))}
              </tr>
            </tbody>
          </Table>
        </div>

        <Table bordered className={styles.secondaryTable}>
          <tbody>
            <tr>
              <td className={styles.labelCellSec}>참&nbsp;&nbsp;&nbsp;조</td>
              <td className={styles.valueCell}>
                {(reportData?.reference || []).map((ref, index) => (
                  <span key={index}>{ref.emp_name}{index < reportData.reference.length - 1 && ', '}</span>
                ))}
              </td>
              <td className={styles.labelCellSec}>수&nbsp;&nbsp;&nbsp;신</td>
              <td className={styles.valueCell}>
                {(reportData?.recipient || []).map((recv, index) => (
                  <span key={index}>{recv.emp_name}{index < reportData.recipient.length - 1 && ', '}</span>
                ))}
              </td>
            </tr>
          </tbody>
        </Table>

        <Table bordered className={styles.secondaryTable}>
          <tbody>
            <tr>
              <td colSpan="4" className={styles.valueCellContent}>
                {reportData?.repo_content || ''}
              </td>
            </tr>
          </tbody>
        </Table>

        <Table bordered>
          <tbody>
            <tr>
              <td colSpan="4" className={styles.labelCellFile}>첨부 파일</td>
            </tr>
            <tr>
              <td colSpan="4" className={styles.valueCellFile}>
                {reportData?.files && reportData.files.length > 0 ? (
                  <ul>
                    {reportData.files.map((file, index) => (
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

export default CompanyUserDraftDetailWork;
