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
import HandleSaveAsDraft from '../../componentFetch/dataSaveFetch/handleSaveAsDraftWork';
import HandleSaveDraft from '../../componentFetch/dataSaveFetch/handleSaveDraftWork';

const CompanyUserDraftWriteWork = () => {
  const location = useLocation();
  const [reportTitle, setReportTitle] = useState(location.state?.reportTitle || '');
  const [reportContent, setReportContent] = useState(location.state?.reportContent || '');
  const [reportDate, setReportDate] = useState(location.state?.reportDate || new Date().toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }));
  const [repoStartTime, setRepoStartTime] = useState(location.state?.repoStartTime || '');
  const [repoEndTime, setRepoEndTime] = useState(location.state?.repoEndTime || '');
  const [reportStatus, setReportStatus] = useState('작성 중');
  const [selectedApprovers, setSelectedApprovers] = useState(location.state?.selectedApprovers || []);
  const [selectedReferences, setSelectedReferences] = useState(location.state?.selectedReferences || []);
  const [selectedReceivers, setSelectedReceivers] = useState(location.state?.selectedReceivers || []);
  const [files, setFiles] = useState(location.state?.files || []);

  

  const [showModal, setShowModal] = useState(false); // 결재선 모달 상태

  

  const [showCancelModal, setShowCancelModal] = useState(false); // 취소 버튼 모달 상태
  const [showSaveModal, setShowSaveModal] = useState(false); // 임시 저장 확인 모달 상태
  const [isSaved, setIsSaved] = useState(false); // 임시 저장 여부
  const [saveDate, setSaveDate] = useState(''); // 임시 저장 날짜
  const [showAlert, setShowAlert] = useState(false); // 임시 저장 알림 상태
  const [alertMessage, setAlertMessage] = useState(''); // 알림 메시지 상태 추가

  const [formErrors, setFormErrors] = useState({});
  const token = localStorage.getItem('jwt');
  const userData = useFetchData(token);

  useEffect(() => {
    setReportDate(new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }));
  }, []);

  const navigate = useNavigate();

  // 모달을 열고 닫는 함수
  const handleShowCancelModal = () => setShowCancelModal(true);
  const handleCloseCancelModal = () => setShowCancelModal(false);

  const handleApprLineModal = () => setShowModal(true); // 결재선 모달 열기
  const handleModalClose = (clearData = false) => {
    setShowModal(false); // 결재선 모달 닫기
    if (clearData) {
      setSelectedApprovers([]);
      setSelectedReferences([]);
      setSelectedReceivers([]);
    }
  };

  const handleSaveAsDraftAndRedirect = () => {
    setIsSaved(true);
    setSaveDate(new Date().toLocaleDateString('ko-KR'));
    setShowCancelModal(false);
    setShowSaveModal(true);
  };

  const handleRedirectAfterSave = () => {
    setShowSaveModal(false);
    navigate('/company/user/draft/doc/draft');
  };

  // ref를 통해 HandleSaveAsDraft 컴포넌트에 접근
  const saveDraftRef = useRef(null);
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
      // 임시 저장 API 호출
      await saveDraftRef.current();

      setAlertMessage(`임시 저장되었습니다. 현재 날짜: ${currentDate}`);
      setShowAlert(true);
    } catch (error) {
      console.error("Error saving draft:", error);
      setAlertMessage("임시 저장에 실패했습니다.");
      setShowAlert(true);
    }
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handlePreview = () => {
    navigate('/company/user/draft/form/work', {
      state: {
        reportTitle,
        reporter: userData?.emp_name,
        reportDate,
        department: userData?.dept_name,
        reportContent,
        repoStartTime,
        repoEndTime,
        selectedApprovers,
        selectedReferences,
        selectedReceivers,
        files
      },
    });
  };

      // 성공 시 Alert에 성공 메시지 표시
      setAlertMessage(`임시 저장되었습니다. 현재 날짜: ${currentDate}`);
      setShowAlert(true);
    } catch (error) {
      // 실패 시 Alert에 실패 메시지 표시
      console.error("Error saving draft:", error);
      setAlertMessage("임시 저장에 실패했습니다.");
      setShowAlert(true);
    }

    // 5초 후 Alert 창 자동 닫기
    setTimeout(() => setShowAlert(false), 5000);
  };


  const handleSubmitClick = () => {
    const errors = {};
    if (!reportTitle) errors.reportTitle = true;
    if (!reportContent) errors.reportContent = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    navigate('/company/user/draft/form/work');
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
            />
          ) : (
            <p>Loading user information...</p>
          )}
          {userData ? (
            <ApprovalLineTable handleApprLineModal={handleApprLineModal} reporter={userData.emp_name} posiName={userData.posi_name} approvers={selectedApprovers} />
          ) : (
            <p>Loading user information...</p>
          )}
        </div>

        {/* 참조자 및 수신자 정보 */}
        <Table bordered className={styles.docContent}>
          <tbody>
            <tr>
              <td className={styles.docKey}>참 &nbsp;&nbsp;&nbsp; 조</td>
              <td className={styles.docValueRen}>
                {selectedReferences.map((ref, index) => (
                  <span key={index}>
                    {ref.type === 'person' && ref.emp_name}
                    {ref.type === 'department' && (
                      <>
                        {ref.teamName || ref.deptName}
                      </>
                    )}
                    {index < selectedReferences.length - 1 && ', '}
                  </span>
                ))}
              </td>
              <td className={styles.docKey}>수 &nbsp;&nbsp;&nbsp; 신</td>
              <td className={styles.docValueRen}>
                {selectedReceivers.map((recv, index) => (
                  <span key={index}>
                    {recv.type === 'person' && recv.emp_name}
                    {recv.type === 'department' && (
                      <>
                        {recv.teamName || recv.deptName}
                      </>
                    )}
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
                {/* files와 setFiles를 전달하여 FileUploader에서 파일 상태를 관리하도록 합니다 */}
                <FileUploader files={files} setFiles={setFiles} />
              </td>
            </tr>
          </tbody>
        </Table>
      </Form>
      
      <SaveModals
        showCancelModal={showCancelModal}
        handleCloseCancelModal={handleCloseCancelModal}
        handleSaveAsDraftAndRedirect={handleSaveAsDraftAndRedirect}
        showSaveModal={showSaveModal}
        alertMessage={alertMessage}
        handleRedirectAfterSave={handleRedirectAfterSave}
        showAlert={showAlert}
        saveDate={saveDate}
        setShowAlert={setShowAlert}
      />

      <SaveModals
        showCancelModal={showCancelModal} // 주석 처리한 showCancelModal
        handleCloseCancelModal={handleCloseCancelModal}
        handleSaveAsDraftAndRedirect={handleSaveAsDraftAndRedirect}
        showSaveModal={showSaveModal} // 주석 처리한 showSaveModal
        alertMessage={alertMessage}
        handleRedirectAfterSave={handleRedirectAfterSave}
        showAlert={showAlert}
        saveDate={saveDate}
        setShowAlert={setShowAlert}
      />

      {/* 결재선 지정 모달 */}
      {showModal && (
        <ApprovalLine showModal={showModal} handleModalClose={handleModalClose}
          selectedApprovers={selectedApprovers}
          setSelectedApprovers={setSelectedApprovers}
          selectedReferences={selectedReferences}
          setSelectedReferences={setSelectedReferences}
          selectedReceivers={selectedReceivers}
          setSelectedReceivers={setSelectedReceivers} />
      )}

      <div className={styles.btnBox}>
        <Button className={styles.cancelBtn} onClick={handleShowCancelModal}>
          취소
        </Button>
        <Button className={styles.saveAsBtn} onClick={handleSaveAsDraftClick}>
          임시 저장
        </Button>
        <Button className={styles.saveBtn} onClick={handlePreview}>
          결재 상신
        </Button>
      </div>


      {/* 임시 저장 */}
      <HandleSaveAsDraft
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
        setIsSaved={setIsSaved}
        setSaveDate={setSaveDate}
        setShowAlert={setShowAlert}
        setAlertMessage={setAlertMessage}
      />

      {/* 저장 (미리보기 폼 이동) */}
      <HandleSaveDraft
        reportTitle={reportTitle}
        reportContent={reportContent}
        reportDate={reportDate}
        repoStartTime={repoStartTime}
        repoEndTime={repoEndTime}
        reportStatus={reportStatus}
        selectedApprovers={selectedApprovers}
        selectedReferences={selectedReferences}
        selectedReceivers={selectedReceivers}
        token={token}
        setIsSaved={setIsSaved}
        setSaveDate={setSaveDate}
        setShowAlert={setShowAlert}
      />
    </div>
  );
};

export default CompanyUserDraftWriteWork;
