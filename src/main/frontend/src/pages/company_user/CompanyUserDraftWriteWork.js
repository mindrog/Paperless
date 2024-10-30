import React, { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/company/company_draft_write_work.module.css';
import DraftTitleInput from '../company_user/draftWriteComponent/DraftTitleInput';
import DraftDocInfoTable from '../company_user/draftWriteComponent/DraftDocInfoTable';
import ApprovalLineTable from '../company_user/draftWriteComponent/ApprovalLineTable';
import ContentEditor from '../company_user/draftWriteComponent/ContentEditor';
import FileUploader from '../company_user/draftWriteComponent/FileUploader';
import SaveModals from '../company_user/draftWriteComponent/SaveModals';
import ApprovalLine from '../layout/ApprovalLine';
import useFetchData from '../../componentFetch/useFetchData';

const CompanyUserDraftWriteWork = () => {
  const [reportTitle, setReportTitle] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [repoStartTime, setRepoStartTime] = useState('');
  const [repoEndTime, setRepoEndTime] = useState('');
  const [reportStatus, setReportStatus] = useState('작성 중');

  const [showModal, setShowModal] = useState(false); // 결재선 모달 상태
  const [showCancelModal, setShowCancelModal] = useState(false); // 취소 버튼 모달 상태
  const [showSaveModal, setShowSaveModal] = useState(false); // 임시 저장 확인 모달 상태
  const [isSaved, setIsSaved] = useState(false); // 임시 저장 여부
  const [saveDate, setSaveDate] = useState(''); // 임시 저장 날짜
  const [showAlert, setShowAlert] = useState(false); // 임시 저장 알림 상태
  const [formErrors, setFormErrors] = useState({});
  const [files, setFiles] = useState([]); // 첨부된 파일들을 저장할 상태

  // 통신
  const token = localStorage.getItem('jwt');
  const userData = useFetchData(token);

  useEffect(() => {
    if (userData === null) {
      console.log("Warning: userData is null. Please check the API response.");
    }
  }, [userData]);

  // 기안날짜 (현재 날짜 불러오기)
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
  const handleModalClose = () => setShowModal(false); // 결재선 모달 닫기

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

  const handleSaveAsDraftClick = () => {
    setIsSaved(true);
    setSaveDate(new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }));
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000); // 5초 후 알림 창 자동 닫기
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
            <p>Loading user information...</p> // 로딩 중 표시
          )}
          <ApprovalLineTable handleApprLineModal={handleApprLineModal} reporter={userData.emp_name} />
        </div>
        <Table bordered className={styles.docContent}>
          <tbody>
            <tr>
              <td className={styles.docKey}>참 &nbsp;&nbsp;&nbsp; 조</td>
              <td></td>
              <td className={styles.docKey}>수 &nbsp;&nbsp;&nbsp; 신</td>
              <td></td>
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
              <td colSpan="2" className={styles.centerContent}>
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
        handleRedirectAfterSave={handleRedirectAfterSave}
        showAlert={showAlert}
        saveDate={saveDate}
        setShowAlert={setShowAlert}
      />

      {/* 결재선 지정 모달 */}
      <ApprovalLine showModal={showModal} handleModalClose={handleModalClose} />

      <div className={styles.btnBox}>
        <Button className={styles.cancelBtn} onClick={handleShowCancelModal}>
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
