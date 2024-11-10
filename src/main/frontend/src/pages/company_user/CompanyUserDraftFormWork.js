import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styles from '../../styles/company/draftForm/draft_Form_work.module.css';
import { Button, Table, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

const CompanyUserDraftFormWork = () => {
  const { reportId } = useParams();
  const saveDraftRef = useRef();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [actionType, setActionType] = useState('draft');
  const currentSaveDraftDate = moment().format("YYYY-MM-DD");
  const printRef = useRef();

  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`/api/reportform/${reportId}`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch report data:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [reportId]);

  const handleCancel = () => {
    navigate('/company/user/draft/write/work', { state: reportData });
  };

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    if (!element) {
      console.error("printRef가 올바른 DOM 요소를 참조하지 않습니다.");
      return;
    }

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(reportData ? `${reportData.reportTitle}_기안_미리보기.pdf` : '기안_미리보기.pdf');
  };

  const handleSubmitForApproval = () => {
    if (saveDraftRef.current) {
      saveDraftRef.current('submit');
    }
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      navigate(`/company/user/draft/detail/work/${reportId}`);
    }, 3000);
  };

  if (!reportData) return <p>Loading...</p>;

  return (
    <div className="container">
      <div className={styles.formHeader}>
        <h2 className={styles.pageTitle}>기안 미리보기</h2>
      </div>

      <div className={styles.backsection} ref={printRef}>
        <div className={styles.apprSumbitBtnBox}>
          <Button className={styles.cancelBtn} onClick={handleCancel}>취소</Button>
          <Button className={styles.pdfBtn} onClick={handleDownloadPdf}>pdf 변환</Button>
          <Button className={styles.apprSumbitBtn} onClick={handleSubmitForApproval}>결재 상신</Button>
        </div>

        <div className={styles.contentsection}>
          <Table bordered className={styles.mainTable} style={{ width: '800px', marginTop: '1px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td colSpan="2" className={styles.titleCell}>기&nbsp;&nbsp;안&nbsp;&nbsp;용&nbsp;&nbsp;지</td>
              </tr>
            </tbody>
          </Table>

          <Table bordered>
            <tbody>
              <tr>
                <td className={styles.labelCellTitle}>제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;목</td>
                <td className={styles.valueCellrepoTitle}>{reportData.reportTitle}</td>
              </tr>
            </tbody>
          </Table>

          <div className={styles.docInfoSection}>
            <Table bordered size="sm" className={styles.innerTable}>
              <tbody>
                <tr>
                  <td className={styles.labelCell}>문서번호</td>
                  <td className={styles.valueCellCode}>{reportData.repo_code}</td>
                </tr>
                <tr>
                  <td className={styles.labelCell}>기&nbsp;안&nbsp;일</td>
                  <td className={styles.valueCell}>{moment(reportData.reportDate).format("YYYY-MM-DD")}</td>
                </tr>
                <tr>
                  <td className={styles.labelCell}>기 안 자</td>
                  <td className={styles.valueCell}>{reportData.emp_name}</td>
                </tr>
                <tr>
                  <td className={styles.labelCell}>시행일자</td>
                  <td className={styles.valueCell}>{reportData.repoStartTime}</td>
                </tr>
                <tr>
                  <td className={styles.labelCell}>마감일자</td>
                  <td className={styles.valueCell}>{reportData.repoEndTime}</td>
                </tr>
              </tbody>
            </Table>
          </div>

          {/* 결재자 정보 테이블 */}
          <Table bordered>
            <tbody>
              {reportData.approverInfo && reportData.approverInfo.length > 0 && (
                <>
                  <tr>
                    <td colSpan="2" className={styles.detailsTitle}>결재자 정보</td>
                  </tr>
                  {reportData.approverInfo.map((approver, index) => (
                    <tr key={index}>
                      <td>{approver.emp_name}</td>
                      <td>{approver.dept_team_name}</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </Table>

          <Table bordered className={styles.docContent}>
            <tbody>
              <tr>
                <td className={styles.docKey}>참 &nbsp;&nbsp;&nbsp; 조</td>
                <td className={styles.docValueRen}>
                  {reportData.selectedReferences && reportData.selectedReferences.map((ref, index) => (
                    <span key={index}>
                      {ref.type === 'person' ? ref.emp_name : (ref.teamName || ref.deptName)}
                      {index < reportData.selectedReferences.length - 1 && ', '}
                    </span>
                  ))}
                </td>
                <td className={styles.docKey}>수 &nbsp;&nbsp;&nbsp; 신</td>
                <td className={styles.docValueRen}>
                  {reportData.selectedReceivers && reportData.selectedReceivers.map((recv, index) => (
                    <span key={index}>
                      {recv.type === 'person' ? recv.emp_name : (recv.teamName || recv.deptName)}
                      {index < reportData.selectedReceivers.length - 1 && ', '}
                    </span>
                  ))}
                </td>
              </tr>
            </tbody>
          </Table>

          <Table bordered>
            <tbody>
              <tr>
                <td colSpan="4" className={styles.detailsTitle}>상&nbsp;&nbsp;세&nbsp;&nbsp;내&nbsp;&nbsp;용</td>
              </tr>
              <tr>
                <td colSpan="4" className={styles.valueCellContent}>
                  <div dangerouslySetInnerHTML={{ __html: reportData.reportContent }} />
                </td>
              </tr>
            </tbody>
          </Table>

          <Table bordered>
            <tbody>
              <tr>
                <td colSpan="4" className={styles.valueCellFile}>첨부 파일</td>
              </tr>
              <tr>
                <td colSpan="4" className={styles.valueCellFile}>
                  {reportData.files && reportData.files.length > 0 ? (
                    <ul>
                      {reportData.files.map((file, index) => (
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
  );
};

export default CompanyUserDraftFormWork;
