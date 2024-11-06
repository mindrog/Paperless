import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import styles from '../../styles/company/company_draft_write_work.module.css';
import DraftTitleInput from '../company_user/draftWriteComponent/DraftTitleInput';
import DraftDocInfoTable from '../company_user/draftWriteComponent/DraftDocInfoTable';
import ApprovalLineTable from '../company_user/draftWriteComponent/ApprovalLineTable';
import ContentEditor from '../company_user/draftWriteComponent/ContentEditor';
import FileUploader from '../company_user/draftWriteComponent/FileUploader';
import SaveModals from '../company_user/draftWriteComponent/SaveModals';
import ApprovalLine from '../layout/ApprovalLine';
import useFetchData from '../../componentFetch/useFetchData';
import HandleSaveReport from '../../componentFetch/dataSaveFetch/handleSaveDraftWork';

const CompanyUserDraftWriteWork = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  const userData = useFetchData(token);

  // 상태 변수 정의
  const [reportId, setReportId] = useState(null);
  const [reportTitle, setReportTitle] = useState(location.state?.reportTitle || '');
  const [reportContent, setReportContent] = useState(location.state?.reportContent || '');
  const [reportDate, setReportDate] = useState('');
  const [repoStartTime, setRepoStartTime] = useState('');
  const [repoEndTime, setRepoEndTime] = useState('');
  const [reportStatus, setReportStatus] = useState('작성 중');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [saveDate, setSaveDate] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // 결재선 관련 상태 변수
  const [selectedApprovers, setSelectedApprovers] = useState(location.state?.selectedApprovers || []);
  const [selectedReferences, setSelectedReferences] = useState(location.state?.selectedReferences || []);
  const [selectedReceivers, setSelectedReceivers] = useState(location.state?.selectedReceivers || []);
  const [files, setFiles] = useState(location.state?.files || []);
  const [formErrors, setFormErrors] = useState({
    reportTitle: false,
    reportContent: false,
    repoStartTime: false,
    repoEndTime: false,
  });
  const [isSaved, setIsSaved] = useState(false);

  const saveDraftRef = useRef(null);

  useEffect(() => {
    setReportDate(new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }));
  }, []);

  // 자동 임시 저장 기능
  useEffect(() => {
    const autoSave = async () => {
      try {
        // reportId가 존재하는 경우에만 새로 설정되지 않도록 유지
        if (reportId) {
          const result = await saveDraftRef.current();
          if (result && result.reportId) {
            setReportId((prevId) => prevId || result.reportId); // 기존 reportId 유지
          }
        }
      } catch (error) {
        console.error('Error during auto-save:', error);
      }
    };

    const saveInterval = setInterval(autoSave, 60000);
    return () => clearInterval(saveInterval);
  }, [reportTitle, reportContent, repoStartTime, repoEndTime, selectedApprovers, selectedReferences, selectedReceivers]);

  // 임시 저장 버튼 클릭
  const handleSaveAsDraftClick = async () => {
    const currentDate = new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    setSaveDate(currentDate);

    try {
      // reportId가 없을 때에만 새로운 임시 저장 ID 생성
      const result = await saveDraftRef.current();
      if (result && result.reportId) {
        setReportId(result.reportId);
      }
      setAlertMessage(`임시 저장되었습니다. 현재 날짜: ${currentDate}`);
      setShowAlert(true);
    } catch (error) {
      console.error("Error saving draft:", error);
      setAlertMessage("임시 저장에 실패했습니다.");
      setShowAlert(true);
    }

    setTimeout(() => setShowAlert(false), 60000);
  };

  const handleSubmitClick = async () => {
    const errors = {};
    if (!reportTitle) errors.reportTitle = true;
    if (!reportContent) errors.reportContent = true;
    if (!repoStartTime) errors.repoStartTime = true;
    if (!repoEndTime) errors.repoEndTime = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const result = await saveDraftRef.current();
      if (result && result.reportId) {
        setReportId(result.reportId);
      }
      navigate(`/company/user/draft/approval/detail/work/${reportId}`);
      navigate('/company/user/draft/form/work', {
        state: {
          reportTitle,
          reporter: userData ? userData.emp_name : '',
          department: userData ? userData.dept_name : '',
          reportDate,
          reportContent,
          repoStartTime,
          repoEndTime,
          selectedApprovers,
          selectedReferences,
          selectedReceivers,
          reportId,
          actionType: "submit",
          token,
          files,
        },
      });
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  console.log("reportId :", reportId);

  // 상세페이지로 reportId 보내기
  const handleDetailPage = () => {
    navigate(`/company/user/draft/detail`, {
      state: {
        reportId,
        reportTitle,  // 업무 보고 기안의 제목
        reportContent,  // 상세 내용
        reporter : userData.emp_name,  // 기안자 정보
        department : userData.dept_name,  // 부서 정보
        reportDate,  // 기안일
        repoStartTime,  // 시행일자
        repoEndTime,  // 마감일자
        selectedApprovers,  // 결재자 정보
        selectedReferences,  // 참조자 정보
        selectedReceivers,  // 수신자 정보
        files  // 첨부 파일
      }
    });
  };

  return (
    <div className="container">
      <h2 className={styles.pageTitle}>업무 보고 기안</h2>
      <Form>
        <DraftTitleInput reportTitle={reportTitle} setReportTitle={setReportTitle} />
        <div className={styles.docHeader}>
          {userData ? (
            <DraftDocInfoTable
              department={userData.dept_name}
              team={userData.dept_team_name}
              reporter={userData.emp_name}
              reportDate={reportDate}
              repoStartTime={repoStartTime}
              repoEndTime={repoEndTime}
              reportStatus={reportStatus}
              onStartDateChange={setRepoStartTime}
              onEndDateChange={setRepoEndTime}
              startTimeError={formErrors.repoStartTime}
              endTimeError={formErrors.repoEndTime}
            />
          ) : (
            <p>Loading user information...</p>
          )}

          {userData ? (
            <ApprovalLineTable handleApprLineModal={() => setShowModal(true)} reporter={userData.emp_name} posiName={userData.posi_name} approvers={selectedApprovers} />
          ) : (
            <p>Loading user information...</p>
          )}
        </div>

        <Table bordered className={styles.docContent}>
          <tbody>
            <tr>
              <td className={styles.docKey}>참 &nbsp;&nbsp;&nbsp; 조</td>
              <td className={styles.docValueRen}>
                {selectedReferences.map((ref, index) => (
                  <span key={index}>
                    {ref.type === 'person' ? ref.emp_name : (ref.teamName || ref.deptName)}
                    {index < selectedReferences.length - 1 && ', '}
                  </span>
                ))}
              </td>
              <td className={styles.docKey}>수 &nbsp;&nbsp;&nbsp; 신</td>
              <td className={styles.docValueRen}>
                {selectedReceivers.map((recv, index) => (
                  <span key={index}>
                    {recv.type === 'person' ? recv.emp_name : (recv.teamName || recv.deptName)}
                    {index < selectedReceivers.length - 1 && ', '}
                  </span>
                ))}
              </td>
            </tr>
          </tbody>
        </Table>

        <ContentEditor reportContent={reportContent} setReportContent={setReportContent} />

        <Table bordered className={styles.docContent}>
          <tbody>
            <tr>
              <td colSpan="2" className={`${styles.docKeyFile} ${styles.centerText}`}>첨부 파일</td>
            </tr>
            <tr>
              <td colSpan={5} className={styles.centerContent}>
                <FileUploader files={files} setFiles={setFiles} />
              </td>
            </tr>
          </tbody>
        </Table>
      </Form>

      <SaveModals
        showCancelModal={showCancelModal}
        handleCloseCancelModal={() => setShowCancelModal(false)}
        handleSaveAsDraftAndRedirect={() => {
          setIsSaved(true);
          setSaveDate(new Date().toLocaleDateString('ko-KR'));
          setShowCancelModal(false);
          setShowSaveModal(true);
        }}
        showSaveModal={showSaveModal}
        alertMessage={alertMessage}
        handleRedirectAfterSave={() => navigate('/company/user/draft/doc/draft')}
        showAlert={showAlert}
        saveDate={saveDate}
        setShowAlert={setShowAlert}
      />

      {showModal && (
        <ApprovalLine
          showModal={showModal}
          handleModalClose={() => setShowModal(false)}
          selectedApprovers={selectedApprovers}
          setSelectedApprovers={setSelectedApprovers}
          selectedReferences={selectedReferences}
          setSelectedReferences={setSelectedReferences}
          selectedReceivers={selectedReceivers}
          setSelectedReceivers={setSelectedReceivers}
        />
      )}

      <HandleSaveReport
        ref={saveDraftRef}
        reportTitle={reportTitle}
        reportContent={reportContent}
        reportDate={reportDate}
        repoStartTime={repoStartTime}
        repoEndTime={repoEndTime}
        reportStatus={reportStatus}
        selectedApprovers={selectedApprovers}
        selectedReferences={selectedReferences}
        selectedReceivers={selectedReceivers}
        files={files}
        token={token}
        reportId={reportId}
        setReportId={setReportId}
        setIsSaved={setIsSaved}
        setSaveDate={setSaveDate}
        setShowAlert={setShowAlert}
        setAlertMessage={setAlertMessage}
      />

      <div className={styles.btnBox}>
        <Button className={styles.cancelBtn} onClick={() => setShowCancelModal(true)}>
          취소
        </Button>
        <Button className={styles.saveAsBtn} onClick={handleSaveAsDraftClick}>
          임시 저장
        </Button>
        <Button className={styles.saveBtn} onClick={handleSubmitClick}>
          결재 상신
        </Button>
      </div>
    </div>
  );
};

export default CompanyUserDraftWriteWork;