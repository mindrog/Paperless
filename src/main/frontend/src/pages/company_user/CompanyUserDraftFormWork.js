import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styles from '../../styles/company/draftForm/draft_Form_work.module.css';
import { Button, Table, Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import HandleSaveDraftWork from '../../componentFetch/dataSaveFetch/handleSaveDraftWork';

const CompanyUserDraftFormWork = () => {
  const location = useLocation();
  const saveDraftRef = useRef();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('')
  const [actionType, setActionType] = useState('draft');
  const currentSaveDraftDate = moment().format("YYYY-MM-DD");
  const printRef = useRef(); // PDF로 변환할 영역을 참조하는 ref

  const {
    reportTitle = '',
    reporter = '',
    department = '',
    reportDate = '',
    reportContent = '',
    repoStartTime = '',
    repoEndTime = '',
    selectedApprovers = [],
    selectedReferences = [],
    selectedReceivers = [],
    files = [],
    reportId,
    token
  } = location.state || {}; // 전달된 state 데이터 가져오기

  console.log("CompanyUserDraftFormWork - reportId : " + reportId);

  const handleCancel = () => {
    // 상태 데이터를 전달하여 CompanyUserDraftWriteWork로 이동
    navigate('/company/user/draft/write/work', {
      state: {
        reportTitle,
        reportContent,
        reportDate,
        repoStartTime,
        repoEndTime,
        selectedApprovers,
        selectedReferences,
        selectedReceivers,
        reportId,
        files,
      },
    });
  };

  // PDF 다운로드 함수
  const handleDownloadPdf = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    // printRef가 제대로 DOM 요소를 참조하는지 확인
    if (!element) {
      console.error("printRef가 올바른 DOM 요소를 참조하지 않습니다.");
      return;
    }

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(reportTitle + '_기안_미리보기.pdf');
  };

  // 결재 상신
  const handleSubmitForApproval = () => {
    if (saveDraftRef.current) {
      saveDraftRef.current('submit'); // 결재 상신 시 "submit"을 전달
    }
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      navigate(`/company/user/draft/detail/work/${reportId}`);
    }, 3000);
  };

  return (
    <div className="container">
      <div className={styles.formHeader}>
        <h2 className={styles.pageTitle}>기안 미리보기</h2>
      </div>

      <div className={styles.backsection} ref={printRef}>
        <div className={styles.apprSumbitBtnBox}>
          <div>
            <Button className={styles.cancelBtn} onClick={handleCancel}>취소</Button>
          </div>
          <div>
            <Button className={styles.pdfBtn} onClick={handleDownloadPdf}>pdf 변환</Button>

            <Button className={styles.apprSumbitBtn} onClick={handleSubmitForApproval}>결재 상신</Button>
          </div>
        </div>
        <div>
          <HandleSaveDraftWork
            ref={saveDraftRef}
            reportTitle={reportTitle}
            reportContent={reportContent}
            reportDate={reportDate}
            repoStartTime={repoStartTime}
            repoEndTime={repoEndTime}
            reportStatus="작성 중"
            selectedApprovers={selectedApprovers}
            selectedReferences={selectedReferences}
            selectedReceivers={selectedReceivers}
            files={files}
            token={token}
            reportId={reportId}
            setIsSaved={() => { }}
            setSaveDate={currentSaveDraftDate}
            setShowAlert={() => { }}
            setAlertMessage={setAlertMessage}
            actionType={actionType}
          />

          {/* 모달 창 */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Body className="text-center">정상적으로 상신 되었습니다</Modal.Body>
          </Modal>

          <div className={styles.contentsection}>
            <Table bordered className={styles.mainTable} style={{ width: '800px', marginTop: '1px', borderCollapse: 'collapse' }}>
              <colgroup>
                <col width="310" />
                <col width="490" />
              </colgroup>
              <tbody>
                <tr>
                  <td colSpan="2" className={styles.titleCell}>
                    기&nbsp;&nbsp;안&nbsp;&nbsp;용&nbsp;&nbsp;지
                  </td>
                </tr>
              </tbody>
            </Table>
            <Table bordered>
              <tbody>
                <tr>
                  <td className={styles.labelCellTitle}>제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;목</td>
                  <td className={styles.valueCellrepoTitle}>{reportTitle}</td>
                </tr>
              </tbody>
            </Table>

            <div className={styles.docInfoSection}>
              <Table bordered size="sm" className={styles.innerTable}>
                <tbody>
                  <tr>
                    <td className={styles.labelCell}>문서번호</td>
                    <td className={styles.valueCell}></td>
                  </tr>
                  <tr>
                    <td className={styles.labelCell}>부&nbsp;&nbsp;&nbsp;서</td>
                    <td className={styles.valueCell}>{department}</td>
                  </tr>
                  <tr>
                    <td className={styles.labelCell}>기&nbsp;안&nbsp;일</td>
                    <td className={styles.valueCell}>
                      {moment(reportDate, "YYYY. MM. DD. A hh:mm").format("YYYY-MM-DD")}
                    </td>
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
                <tbody className="apprLineTbody">
                  <tr className="apprLinedocTr">
                    <td className={styles.valueCell}>상신</td>
                    {selectedApprovers.map((_, index) => (
                      <td key={index} className={styles.valueCell}>결재</td>
                    ))}
                  </tr>

                  <tr>
                    <td className={styles.docValueAppr}>{reporter}</td>
                    {selectedApprovers.map((approver, index) => (
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
                      {currentSaveDraftDate}
                    </td>
                    {selectedApprovers.map((_, index) => (
                      <td key={index} className={styles.docValue_date}>

                      </td>
                    ))}
                  </tr>
                </tbody>
              </Table>
            </div>

            <Table bordered className={styles.secondaryTable}>
              <tbody>
                <tr>
                  <td className={styles.labelCellCol}>참&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;조</td>
                  <td className={styles.valueCell}>
                    {selectedReferences.map((ref, index) => (
                      <span key={index}>
                        {ref.type === 'person' && ref.emp_name}
                        {ref.type === 'department' && (ref.teamName || ref.deptName)}
                        {index < selectedReferences.length - 1 && ', '}
                      </span>
                    ))}
                  </td>
                  <td className={styles.labelCellCol}>수&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;신</td>
                  <td className={styles.valueCell}>
                    {selectedReceivers.map((recv, index) => (
                      <span key={index}>
                        {recv.type === 'person' && recv.emp_name}
                        {recv.type === 'department' && (recv.teamName || recv.deptName)}
                        {index < selectedReceivers.length - 1 && ', '}
                      </span>
                    ))}
                  </td>
                </tr>
              </tbody>
            </Table>
            <Table bordered className={styles.secondaryTable}>
              <tbody>
                <tr>
                  <td colSpan="4" className={styles.detailsTitle}>상&nbsp;&nbsp;세&nbsp;&nbsp;내&nbsp;&nbsp;용</td>
                </tr>
                <tr>
                  <td colSpan="4" className={styles.valueCellContent}>
                    <div dangerouslySetInnerHTML={{ __html: reportContent }} />
                  </td>
                </tr>
              </tbody>
            </Table>

            <Table bordered>
              <tbody>
                <tr>
                  <td colSpan="4" className={styles.valueCellFile}>
                    첨부 파일
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className={styles.valueCellFile}>
                    {files && files.length > 0 ? (
                      <ul>
                        {files.map((file, index) => (
                          <li key={index} className={styles.fileList}>📄 {file.name}</li>
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
      </div>
    </div>
  );
};

export default CompanyUserDraftFormWork;
