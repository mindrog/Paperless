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

  const [reportId, setReportId] = useState(null);
  const [reportTitle, setReportTitle] = useState(location.state?.reportTitle || '');
  const [reportContent, setReportContent] = useState(location.state?.reportContent || '');
  const [reportDate, setReportDate] = useState('');
  const [repoStartTime, setRepoStartTime] = useState(location.state?.repoStartTime || '');
  const [repoEndTime, setRepoEndTime] = useState(location.state?.repoEndTime || '');
  const [reportStatus, setReportStatus] = useState('작성 중');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [saveDate, setSaveDate] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
      const result = await saveDraftRef.current();

      if (result && result.reportId) {
        setReportId(result.reportId);
      }

      setAlertMessage(`임시 저장되었습니다.<br/>현재 날짜: ${currentDate}`);
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
    // 이미 존재하는 reportId가 있으면 새로 생성하지 않고 업데이트만 진행
    const result = reportId ? await saveDraftRef.current('draft') : await saveDraftRef.current('submit');
    
    const currentReportId = reportId || (result && result.reportId);
    if (currentReportId) {
      setReportId(currentReportId);

      navigate(`/company/user/draft/form/work/${currentReportId}`, {
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
          files,
        },
      });
    }
  } catch (error) {
    console.error("Error submitting report:", error);
  }
};

  
  // 디버그용
  console.log("====== CompanyUserDraftWriteWork ======");
  console.log("reportId :", reportId);
  console.log("selectedApprovers :", selectedApprovers);
  console.log("selectedReferences :", selectedReferences);
  console.log("selectedReceivers :", selectedReceivers);
  
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
