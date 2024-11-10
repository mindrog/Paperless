import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import styles from '../../styles/company/company_draft_appr_detail_work.module.css';
import moment from 'moment';

// 상신 취소 / 회수 버튼 로직 요청 컨포던트
import { handleCancelSubmission } from '../../componentFetch/apprActionFetch/handleCancelSubmission';
import { handleRetrieveSubmission } from '../../componentFetch/apprActionFetch/handleRetrieveSubmission';


const CompanyUserDraftDetailWork = () => {
  const { reportId } = useParams();

  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 훅
  const [reportData, setReportData] = useState({});
  const [empCodeInfo, setEmpCodeInfo] = useState({});
  const [apprLineInfo, setApprLineInfo] = useState({ approverInfo: [], recipientInfo: [], referenceInfo: [] });
  const [apprIsRead, setApprIsRead] = useState(0);
  const [alertMessage, setAlertMessage] = useState({});

  // 로그인한 사용자 정보
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    if (reportId) {
      const fetchData = async () => {
        try {
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
          setUserId(userInfo.emp_code);
        } catch (error) {
          console.error('Error fetching report data:', error);
        }
      };
      fetchData();
    }
  }, [reportId]);


  // "상신 취소"와 "회수" 버튼 클릭 이벤트 핸들러 추가
  const handleCancelSubmission = async () => {
    try {
      const response = await fetch(`/api/cancel/${reportId}`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('상신이 취소되었습니다.');
        navigate('/company/user/draft/doc/myuser');
      } else {
        alert('상신 취소에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error cancelling submission:', error);
      alert('상신 취소 중 오류가 발생했습니다.');
    }
  };

  const handleRetrieveSubmission = async () => {
    try {
      const response = await fetch(`/api/retrieve/${reportId}`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('문서가 회수되었습니다.');
        navigate('/company/user/draft/doc/myuser');
      } else {
        alert('회수에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error retrieving submission:', error);
      alert('회수 중 오류가 발생했습니다.');
    }
  };

  // 반려
  const handleReject = async () => {
    try {
      const response = await fetch(`/api/report/reject/${reportData.reportId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          approverId: userId,
          status: 'rejected',
        }),
      });
      if (response.ok) {
        setAlertMessage('결재가 반려되었습니다.');
        navigate('/company/user/draft/doc/draft');
      } else {
        setAlertMessage('결재 반려에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error rejecting approval:', error);
      setAlertMessage('결재 반려 중 오류가 발생했습니다.');
    }
  };

  // 결재 승인
  const handleApprove = async () => {
    try {
      const response = await fetch(`/api/report/approve/${reportData.reportId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          approverId: userId,
          status: 'approved',
        }),
      });
      if (response.ok) {
        setAlertMessage('결재가 승인되었습니다.');
        navigate('/company/user/draft/doc/draft');
      } else {
        setAlertMessage('결재 승인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error approving report:', error);
      setAlertMessage('결재 승인 중 오류가 발생했습니다.');
    }
  };

  // 목록으로 이동 버튼 클릭 핸들러
  const handleGoBack = () => navigate('/company/user/draft/doc/all');

  console.log("response data:", JSON.stringify(reportData, null, 2));
  console.log("data.emp_code :", reportData.emp_code);
  console.log("data.reportStatus :", reportData.reportStatus);
  console.log("User info data:", JSON.stringify(empCodeInfo, null, 2));
  console.log("apprs info data:", JSON.stringify(apprLineInfo, null, 2));

  return (
    <div className="container">
      <div className={styles.formHeader}>
        <h2 className={styles.pageTitle}>기안 상세보기</h2>
      </div>

      <div className={styles.formContent}>

        <div className={styles.btnBox}>
          <Button className={styles.submitCancelBtn} onClick={handleGoBack}>
            목록으로
          </Button>
          {/* 작성자와 로그인한 사용자가 동일하고 결재 상태가 submitted일 때만 버튼 표시 */}
          {userId === reportData.emp_code && reportData.reportStatus === 'submitted' && (
            <div>
              {apprIsRead === 0 && (
                <Button className={styles.submitCancelBtn} onClick={handleCancelSubmission}>
                  상신 취소
                </Button>
              )}
              {apprIsRead === 1 && (
                <Button className={styles.retrieveBtn} onClick={handleRetrieveSubmission}>
                  회수
                </Button>
              )}
            </div>
          )}

          {(reportData.reportStatus === 'pending' || reportData.reportStatus === 'submitted') && // 보고서 상태가 진행 중 또는 제출된 상태인지 확인
            reportData.approverInfo &&
            reportData.approverInfo.some(
              (approverGroup) =>
                approverGroup.approverInfo &&
                approverGroup.approverInfo.some(
                  (approver) =>
                    approver.emp_code === userId && // 로그인한 사용자가 결재자인지 확인
                    approver.appr_status === 'pending' // 결재자의 상태가 'pending'인지 확인
                )
            ) && (
              <div>
                <Button className={styles.rejectBtn} onClick={handleReject}>
                  반려
                </Button>
                <Button className={styles.approveBtn} onClick={handleApprove}>
                  승인
                </Button>
              </div>
            )}
        </div>

        <Table bordered className={styles.mainTable}>
          <tbody>
            <tr>
              <td className={styles.labelCellTitle}>제&nbsp;&nbsp;&nbsp;&nbsp;목</td>
              <td className={styles.valueCell} colSpan="3">{reportData?.reportTitle || ''}</td>
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
                <td className={styles.valueCell}>{reportData?.emp_name || ''}</td>
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
                {apprLineInfo.approverInfo.map((_, index) => (
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
                  <span key={index}>{ref.dept_name} {ref.dept_team_name} {ref.emp_name} {index < apprLineInfo.referenceInfo.length - 1 && ', '}</span>
                ))}
              </td>
              <td className={styles.labelCellSec}>수&nbsp;&nbsp;&nbsp;신</td>
              <td className={styles.valueCell}>
                {apprLineInfo.recipientInfo.map((recv, index) => (
                  <span key={index}>{recv.dept_name} {recv.dept_team_name} {index < apprLineInfo.recipientInfo.length - 1 && ', '}</span>
                ))}
              </td>
            </tr>
          </tbody>
        </Table>

        <Table bordered className={styles.secondaryTable}>
          <tbody>
            <tr>
              <td colSpan="4" className={styles.valueCellContent}>
                <div dangerouslySetInnerHTML={{ __html: reportData?.reportContent }} />
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