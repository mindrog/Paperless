import React, { useState } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/company/company_draft_write_work.module.css';
import style_purc from '../../styles/company/company_draft_write_purc.module.css';
import ApprovalLine from '../layout/ApprovalLine';

const CompanyUserDraftWriteWork = () => {
  const [reportTitle, setReportTitle] = useState('');
  const [reporter, setReporter] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [department, setDepartment] = useState('');
  const [reportContent, setReportContent] = useState('');

  // 각 제품의 정보를 관리하는 상태
  const [productRows, setProductRows] = useState([createEmptyRow()]); // 제품 행 리스트 관리
  const [files, setFiles] = useState([]); // 첨부된 파일들을 저장할 상태

  const [showModal, setShowModal] = useState(false); // 결재선 모달 상태
  const [showCancelModal, setShowCancelModal] = useState(false); // 취소 버튼 모달 상태
  const [showSaveModal, setShowSaveModal] = useState(false); // 임시 저장 확인 모달 상태
  const [isSaved, setIsSaved] = useState(false); // 임시 저장 여부
  const [saveDate, setSaveDate] = useState(''); // 임시 저장 날짜
  const [showAlert, setShowAlert] = useState(false); // 임시 저장 알림 상태
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  // 빈 행 생성 함수
  function createEmptyRow() {
    return {
      productName: '',
      specification: '',
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
      note: ''
    };
  }

  // 제품 리스트의 각 행의 값이 변경될 때 호출되는 함수
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...productRows];
    updatedRows[index][field] = value;

    // 수량과 단가 변경 시 금액 계산
    if (field === 'quantity' || field === 'unitPrice') {
      updatedRows[index].totalPrice = updatedRows[index].quantity * updatedRows[index].unitPrice;
    }

    setProductRows(updatedRows);
  };

  // 행 추가 함수
  const handleAddRow = () => {
    setProductRows([...productRows, createEmptyRow()]);
  };

  // 행 삭제 함수
  const handleRemoveRow = (index) => {
    const updatedRows = productRows.filter((_, i) => i !== index);
    setProductRows(updatedRows);
  };

  // 파일 드래그 앤 드롭 관련 함수들
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files); // 드래그한 파일들 받아오기
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]); // 파일 목록에 추가
  };

  // 첨부된 파일 목록 삭제하는 함수
  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

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
    if (productRows.some(row => !row.productName || row.quantity <= 0 || row.unitPrice <= 0)) {
      errors.productRows = true;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    console.log('결재 상신 버튼 클릭됨');
    navigate('/company/user/draft/form/purchase');
  };

  return (
    <div className="container">
      <h2 className={styles.pageTitle}>구매 신청 기안</h2>
      <Form>
        {/* 기안 제목 */}
        <Table bordered className={styles.docTitleHeader}>
          <thead>
            <tr className={styles.docTitleBox}>
              <th className={styles.docTitle}>기안 제목</th>
              <th colSpan={3}>
                <Form.Control
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className={`${styles.inputForm} ${formErrors.reportTitle ? styles.errorInput : ''}`}
                  placeholder="기안 제목을 입력하세요"
                />
                {formErrors.reportTitle && <span className={styles.errorMessage}>기안 제목을 입력해주세요</span>}
              </th>
            </tr>
          </thead>
        </Table>

        {/* 문서 정보 */}
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
                <td className={styles.docKey}>구매일자</td>
                <td className={styles.docValue}>2024-10-19(금)</td>
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
                  <Button className={styles.apprLineBtn} onClick={handleApprLineModal}>결재선</Button>
                </td>
              </tr>
              <tr>
                <td className={styles.docValue_date}>2024/10/21</td>
                <td>-</td>
              </tr>
            </tbody>
          </Table>
        </div>

        {/* 행 추가/삭제 버튼 */}
        <div className={style_purc.tableRowInsert}>
          <Button className={style_purc.rowInsert} onClick={handleAddRow}>+</Button>
        </div>

        {/* 구매 내용 입력 */}
        <Table bordered className={style_purc.docContent}>
          <thead>
            <tr>
              <th className={style_purc.productName}>품&nbsp;&nbsp;&nbsp;명</th>
              <th className={style_purc.productSize}>규&nbsp;&nbsp;&nbsp;격</th>
              <th className={style_purc.productCount}>수&nbsp;&nbsp;&nbsp;량</th>
              <th className={style_purc.productPrice}>단&nbsp;&nbsp;&nbsp;가</th>
              <th className={style_purc.productPrices}>금&nbsp;&nbsp;&nbsp;액</th>
              <th className={style_purc.productEtc}>비&nbsp;&nbsp;&nbsp;고</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {productRows.map((row, index) => (
              <tr key={index}>
                <td>
                  <Form.Control
                    type="text"
                    value={row.productName}
                    onChange={(e) => handleRowChange(index, 'productName', e.target.value)}
                    className={styles.inputForm}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={row.specification}
                    onChange={(e) => handleRowChange(index, 'specification', e.target.value)}
                    className={styles.inputForm}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={row.quantity}
                    onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
                    className={styles.inputForm}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={row.unitPrice}
                    onChange={(e) => handleRowChange(index, 'unitPrice', e.target.value)}
                    className={styles.inputForm}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={row.totalPrice}
                    readOnly
                    className={styles.inputForm}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={row.note}
                    onChange={(e) => handleRowChange(index, 'note', e.target.value)}
                    className={styles.inputForm}
                  />
                </td>
                <td>
                  <Button variant="danger" onClick={() => handleRemoveRow(index)}>-</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Table bordered className={styles.docContent}>
          <tbody>
            <tr>
              <td className={styles.docKey}>기&nbsp;&nbsp;&nbsp;타</td>
              <td colSpan={5}>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  className={`${styles.inputForm} ${formErrors.reportContent ? styles.errorInput : ''}`}
                  placeholder="기타 내용을 입력하세요"
                />
              </td>
            </tr>

            <tr>
              <td className={styles.docKey}>첨부자료</td>
              <td
                colSpan={5}
                className={styles.dropZone}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                파일을 여기에 드롭하거나 클릭하여 추가하세요
                <ul>
                  {files.map((file, index) => (
                    <li key={index}>
                      {file.name}
                      <Button variant="danger" size="sm" onClick={() => handleRemoveFile(index)}>삭제</Button>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          </tbody>
        </Table>
      </Form>

      {/* 임시 저장 */}
      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible className={styles.customAlert}>
          임시 저장되었습니다. 현재 날짜: {saveDate}
        </Alert>
      )}

      {/* 버튼 */}
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
          <Button variant="secondary" onClick={handleCloseCancelModal} className={styles.modalcancelBtn}>
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

export default CompanyUserDraftWriteWork;
