import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import styles from '../../styles/company/company_draft_appr_detail_work.module.css';
import moment from 'moment';

const CompanyUserDraftDetailWork = () => {
  const { reportId } = useParams();
  const [reportData, setReportData] = useState({});
  const [empCodeInfo, setEmpCodeInfo] = useState({});
  const [apprLineInfo, setApprLineInfo] = useState({ approverInfo: [], recipientInfo: [], referenceInfo: [] });
  const [apprIsRead, setApprIsRead] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (reportId) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("jwt");
          const [draftResponse, userInfoResponse, apprsResponse] = await Promise.all([
            fetch(`/api/report/${reportId}`, {
              headers: { 'Authorization': token, 'Content-Type': 'application/json' },
            }),
            fetch(`/api/getUserInfo`, {
              headers: { 'Authorization': token, 'Content-Type': 'application/json' },
            }),
            fetch(`/api/apprsinfo/${reportId}`, {
              headers: { 'Authorization': token, 'Content-Type': 'application/json' },
            })
          ]);

          if (!draftResponse.ok || !userInfoResponse.ok || !apprsResponse.ok) {
            throw new Error("Failed to fetch data");
          }

          const draftInfo = await draftResponse.json();
          const userInfo = await userInfoResponse.json();
          const apprsInfo = await apprsResponse.json();

          setReportData(draftInfo);
          setEmpCodeInfo(userInfo);
          setApprLineInfo(apprsInfo);
          setApprIsRead(draftInfo.appr_is_read); // 상신 상태 확인

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [reportId]);



  const handleGoBack = () => navigate('/company/user/draft/doc/all');

  return (
    <div className="container">
      <div className={styles.formHeader}>
        <h2 className={styles.pageTitle}>기안 상세보기</h2>
      </div>

      <div className={styles.formContent}>
        <div className={styles.btnBox}>
          <Button className={styles.submitCancelBtn} onClick={handleGoBack}>목록으로</Button>
          <div>
            <Button className={styles.rejectBtn}>반려</Button>
            <Button className={styles.approveBtn}>승인</Button>
          </div>
        </div>

        <Table bordered className={styles.mainTable}>
          <tbody>
            <tr>
              <td className={styles.labelCellTitle}>제&nbsp;&nbsp;&nbsp;&nbsp;목</td>
              <td className={styles.valueCell} colSpan="3">{reportData.reportTitle || ''}</td>
            </tr>
          </tbody>
        </Table>

        <div className={styles.docInfoSection}>
          <Table bordered size="sm" className={styles.innerTable}>
            <tbody>
              <tr>
                <td className={styles.labelCelldoc}>문서번호</td>
                <td className={styles.valueCell}>{reportData.repo_code || ''}</td>
              </tr>
              <tr>
                <td className={styles.labelCelldoc}>부&nbsp;&nbsp;&nbsp;서</td>
                <td className={styles.valueCell}>{empCodeInfo.dept_name || ''} - {empCodeInfo.dept_team_name || ''}</td>
              </tr>
              <tr>
                <td className={styles.labelCelldoc}>기&nbsp;안&nbsp;일</td>
                <td className={styles.valueCell}>
                  {reportData.submission_date ? moment(reportData.submission_date).format("YYYY-MM-DD") : ''}
                </td>
              </tr>
              <tr>
                <td className={styles.labelCelldoc}>기 안 자</td>
                <td className={styles.valueCell}>{reportData.emp_name || ''}</td>
              </tr>
              <tr>
                <td className={styles.labelCelldoc}>시행일자</td>
                <td className={styles.valueCell}>{reportData?.repoStartTime || ''}</td>
              </tr>
              <tr>
                <td className={styles.labelCelldoc}>마감일자</td>
                <td className={styles.valueCell}>{reportData?.repoEndTime || ''}</td>
              </tr>
            </tbody>
          </Table>

          <Table bordered size="sm" className={styles.innerApprTable}>
            <tbody className="apprLineTbody">
              <tr className="apprLinedocTr">
                <td className={styles.valueCellAppr}>상신</td>
                {(apprLineInfo?.approverInfo || []).map((_, index) => (
                  <td key={index} className={styles.valueCellAppr}>결재</td>
                ))}
              </tr>

              <tr>
                <td className={styles.docValueAppr}>
                  <div className={styles.apprTypePosi}>
                    {empCodeInfo.dept_team_name || ''} {empCodeInfo.posi_name || ''}
                  </div>
                  <p>{reportData.emp_name || ''}</p>
                </td>
              {apprLineInfo.approverInfo.map((approver, index) => (
                <td key={index} className={styles.docValueAppr}>
                  <div style={{ position: 'relative' }}>
                    {/* 최상위 approver의 posi_name, emp_name 출력 */}
                    {/* <div className="apprTypePosi">{approver.posi_name}</div>
                    {approver.emp_name} */}
                    {/* 중첩된 approverInfo가 존재할 경우에만 접근 */}
                    {approver.approverInfo && approver.approverInfo.map((innerApprover, innerIndex) => (
                      <div key={innerIndex} style={{ marginLeft: '10px' }}>
                        <div className={styles.apprTypePosi}>{innerApprover.dept_team_name} {innerApprover.posi_name}</div>
                        {innerApprover.emp_name}
                      </div>
                    ))}
                  </div>
                </td>
              ))}
              </tr>

              <tr>
                <td className={styles.docValue_date}>
                  {reportData.submission_date ? moment(reportData.submission_date).format("YYYY-MM-DD") : ''}
                </td>
                {apprLineInfo.approverInfo.map((approver, index) => (
                  <td key={index} className={styles.docValue_date}>
                    {approver.appr_date ? moment(approver.appr_date).format("YYYY-MM-DD") : ''}
                  </td>
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
                {apprLineInfo.referenceInfo.map((ref, index) => (
                  <span key={index}>{ref.emp_name}{index < apprLineInfo.referenceInfo.length - 1 && ', '}</span>
                ))}
              </td>
              <td className={styles.labelCellSec}>수&nbsp;&nbsp;&nbsp;신</td>
              <td className={styles.valueCell}>
                {apprLineInfo.recipientInfo.map((recv, index) => (
                  <span key={index}>{recv.emp_name}{index < apprLineInfo.recipientInfo.length - 1 && ', '}</span>
                ))}
              </td>
            </tr>
          </tbody>
        </Table>

        <Table bordered className={styles.secondaryTable}>
          <tbody>
            <tr>
              <td colSpan="4" className={styles.valueCellContent}>
                {reportData?.reportContent || ''}
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
                {reportData.files && reportData.files.length > 0 ? (
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
