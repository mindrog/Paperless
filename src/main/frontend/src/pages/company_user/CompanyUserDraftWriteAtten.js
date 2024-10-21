import React, { useState } from 'react';
import styles from '../../styles/company/company_draft_write_work.module.css';
import style_atten from '../../styles/company/company_draft_write_atten.module.css';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ApprovalLine from '../layout/ApprovalLine';

const CompanyUserDraftWriteAtten = () => {
  const [reportTitle, setReportTitle] = useState('');
  const [reporter, setReporter] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [department, setDepartment] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [vacationType, setVacationType] = useState('연차'); // 휴가 종류 기본값
  const [startDate, setStartDate] = useState(''); // 시작 날짜
  const [endDate, setEndDate] = useState(''); // 종료 날짜
  const [annualLeaveDays, setAnnualLeaveDays] = useState(0); // 연차 일수 자동 계산
  const [showModal, setShowModal] = useState(false); // 결재선 모달 상태
  const [showCancelModal, setShowCancelModal] = useState(false); // 취소 버튼 모달 상태
  const [showSaveModal, setShowSaveModal] = useState(false); // 임시 저장 확인 모달 상태
  const [isSaved, setIsSaved] = useState(false); // 임시 저장 여부
  const [saveDate, setSaveDate] = useState(''); // 임시 저장 날짜
  const [showAlert, setShowAlert] = useState(false); // 임시 저장 알림 상태
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  // 모달을 열고 닫는 함수
  const handleShowCancelModal = () => setShowCancelModal(true);
  const handleCloseCancelModal = () => setShowCancelModal(false);

  const handleShowSaveModal = () => setShowSaveModal(true); // 임시 저장 모달 표시
  const handleCloseSaveModal = () => setShowSaveModal(false); // 임시 저장 모달 닫기

  // 결재선 모달 열기
  const handleApprLineModal = () => {
    setShowModal(true);
  };

  // 결재선 모달 닫기
  const handleModalClose = () => {
    setShowModal(false);
  };

  // 취소 버튼 클릭 시 모달 띄우기
  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  // 취소 확인 모달에서 "임시 저장"을 선택했을 때 동작
  const handleSaveAsDraftAndRedirect = () => {
    setIsSaved(true);
    setSaveDate(new Date().toLocaleDateString('ko-KR')); // 현재 날짜 저장
    setShowCancelModal(false);
    handleShowSaveModal(); // "임시 저장되었습니다" 모달을 띄움
  };

  // 임시 저장 모달에서 "확인"을 누르면 리다이렉트
  const handleRedirectAfterSave = () => {
    handleCloseSaveModal();
    navigate('/company/user/draft/doc/draft');
  };

  // 임시 저장 버튼 클릭 시 처리
  const handleSaveAsDraftClick = () => {
    setIsSaved(true);
    setSaveDate(new Date().toLocaleDateString('ko-KR')); // 현재 날짜 저장
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000); // 5초 후 알림 창 자동 닫기
  };

  // 결재 상신 버튼 클릭 시 처리
  const handleSubmitClick = () => {
    const errors = {};
    if (!reportTitle) errors.reportTitle = true;
    if (!reportContent) errors.reportContent = true;
    if (!vacationType) errors.vacationType = true;
    if (!startDate || !endDate) errors.period = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    console.log('결재 상신 버튼 클릭됨');
  };

  // 휴가 일수 계산 함수
  const calculateLeaveDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = Math.abs(endDate - startDate);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // 휴가 일수 계산
    return daysDiff;
  };

  // 날짜 변경 시 휴가 일수 업데이트
  const handleDateChange = (e, dateType) => {
    const value = e.target.value;

    if (dateType === 'start') {
      setStartDate(value);
    } else if (dateType === 'end') {
      setEndDate(value);
    }

    // 시작일과 종료일이 모두 있을 때만 휴가 일수 계산
    if (startDate && endDate) {
      const calculatedDays = calculateLeaveDays(startDate, endDate);
      setAnnualLeaveDays(calculatedDays);
    }
  };

  return (
    <div className="container-xl">
      <h2 className={styles.pageTitle}>근태 신청 기안</h2>

      <Form>
        <Table bordered className={styles.docTitleHeader}>
          <thead>
            <tr className={styles.docTitleBox}>
              <th className={styles.docTitle}>기안 제목</th>
              <th colSpan={3}>
                <Form.Control
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className={`${styles.inputForm} ${formErrors.reportTitle ? styles.errorInput : ''}`} // 오류가 있으면 테두리 색상 변경
                  placeholder="기안 제목을 입력하세요"
                />
                {formErrors.reportTitle && <span className={styles.errorMessage}>기안 제목을 입력해주세요</span>}
              </th>
            </tr>
          </thead>
        </Table>

        <div className={styles.docHeader}>
          <Table bordered size="sm" className={styles.docInfo}>
            <tbody>
              <tr>
                <th className={styles.docKey}>문서번호</th>
                <td className={styles.docValue}>-</td>
              </tr>
              <tr>
                <td className={styles.docKey}>본&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;부</td>
                <td className={styles.docValue}>{department || 'Mark'}</td>
              </tr>
              <tr>
                <td className={styles.docKey}>부&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;서</td>
                <td className={styles.docValue}>{reporter || 'Jacob'}</td>
              </tr>
              <tr>
                <td className={styles.docKey}>기안일</td>
                <td className={styles.docValue}>{reportDate || '2024-10-16(수)'}</td>
              </tr>
              <tr>
                <td className={styles.docKey}>기안자</td>
                <td className={styles.docValue}>배수지</td>
              </tr>
              <tr>
                <td className={styles.docKey}>결재 상태</td>
                <td className={styles.docValue}>신청</td>
              </tr>
            </tbody>
          </Table>
          <Table bordered size="sm" className={styles.apprLineBox}>
            <tbody className={styles.apprLineTbody}>
              <tr className={styles.apprLinedocTr}>
                <td className={styles.docKey}>상신</td>
                <td className={styles.docKey}>결재</td>
              </tr>
              <tr>
                <td className={styles.docKey}>배수지</td>
                <td>
                  <Button className={styles.cancelBtn} onClick={handleApprLineModal}>결재선 지정</Button>
                </td>
              </tr>
              <tr>
                <td className={styles.docValue_date}>2024/10/21</td>
                <td>-</td>
              </tr>
            </tbody>
          </Table>
        </div>

        <Table bordered className={styles.docContent}>
          <tbody>
            {/* 휴가 종류 드롭다운 */}
            <tr>
              <td className={styles.docKey}>휴가종류</td>
              <td>
                <Form.Select
                  value={vacationType}
                  onChange={(e) => setVacationType(e.target.value)}
                  className={style_atten.inputForm}
                >
                  <option value="연차">연차</option>
                  <option value="오전반차">오전반차</option>
                  <option value="오후반차">오후반차</option>
                  <option value="병가">병가</option>
                  <option value="경조사휴가">경조사 휴가</option>
                  <option value="공가">공가</option>
                  <option value="기타">기타</option>
                </Form.Select>
              </td>
            </tr>

            {/* 기간 및 일시: 시작일과 종료일 선택 */}
            <tr>
              <td className={styles.docKey}>기간 및 일시</td>
              <td className={style_atten.docKeyDate}>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateChange(e, 'start')}
                  className={style_atten.inputFormDate}
                />
                &nbsp; ~ &nbsp;
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDateChange(e, 'end')}
                  className={style_atten.inputFormDate}
                />
              </td>
            </tr>

            {/* 연차 일수: 자동 계산 */}
            <tr>
              <td className={styles.docKey}>연차 일수</td>
              <td>
                <Form.Control
                  type="number"
                  value={annualLeaveDays}
                  readOnly
                  className={styles.inputForm}
                  placeholder="연차 일수 자동 계산"
                />
              </td>
            </tr>

            {/* 휴가 사유 */}
            <tr>
              <td className={styles.docKey}>휴가 사유</td>
              <td>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  className={`${styles.inputForm} ${formErrors.reportContent ? styles.errorInput : ''}`}
                  placeholder="휴가 사유를 입력하세요"
                />
                {formErrors.reportContent && <span className={styles.errorMessage}>휴가 사유를 입력해주세요</span>}
              </td>
            </tr>
            <tr>
              <td colSpan={4} className={style_atten.AttenContent}>
                <ol>
                  <li>
                    연차의 사용은 근로기준법에 따라 전년도에 발생한 개인별 잔여 연차에 한하여 사용함을 원칙으로 한다.
                  </li>
                  <li>
                    경조사 휴가는 행사일을 증명할 수 있는 가족 관계 증명서 또는 등본, 청첩장 등 제출
                  </li>
                  <li>
                    공가(예비군/민방위)는 사전에 통지서를, 사후에 참석증을 반드시 제출
                  </li>
                </ol>
              </td>
            </tr>
          </tbody>
        </Table>
      </Form>

      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible className={styles.customAlert}>
          임시 저장되었습니다. 현재 날짜: {saveDate}
        </Alert>
      )}

      <div className={styles.btnBox}>
        <Button className={styles.cancelBtn} onClick={handleCancelClick}>
          취소
        </Button>
        <Button className={styles.saveAsBtn} onClick={handleSaveAsDraftClick}>
          임시 저장
        </Button>
        <Button className={styles.saveBtn} onClick={handleSubmitClick}>
          결재 상신
        </Button>
      </div>

      {/* 결재선 지정 모달 */}
      <ApprovalLine showModal={showModal} handleModalClose={handleModalClose} />

      {/* 취소 버튼 모달 */}
      <Modal show={showCancelModal} onHide={handleCloseCancelModal} centered className={styles.cancelModal}>
        <Modal.Body className={styles.cancelModalBody}>작성된 내용을 임시 저장하시겠습니까?</Modal.Body>
        <Modal.Footer className={styles.cancelModalFooter}>
          <Button variant="primary" onClick={handleSaveAsDraftAndRedirect} className={styles.modalSaveBtn}>
            예
          </Button>
          <Button variant="secondary" onClick={handleCloseCancelModal} className={styles.modalCancelBtn}>
            아니오
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 임시 저장 후 모달 */}
      <Modal show={showSaveModal} onHide={handleRedirectAfterSave} centered>
        <Modal.Header closeButton>
          <Modal.Title>임시 저장</Modal.Title>
        </Modal.Header>
        <Modal.Body>임시 저장되었습니다.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleRedirectAfterSave} className={styles.modalSaveBtn}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompanyUserDraftWriteAtten;
