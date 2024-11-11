import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styles from '../../styles/company/draftForm/draft_Form_work.module.css';
import { Button, Table, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

const CompanyUserDraftFormWork = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [approverInfo, setApproverInfo] = useState([]);
  const [recipientInfo, setRecipientInfo] = useState([]);
  const [referenceInfo, setReferenceInfo] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const printRef = useRef();

  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem('jwt');

      // 첫 번째 API 요청: report data
      const reportResponse = await fetch(`/api/reportform/${reportId}`, {
        method: 'GET',
        headers: { 'Authorization': `${token}` },
      });

      // 두 번째 API 요청: approver, recipient, and reference data
      const apprsInfoResponse = await fetch(`/api/apprsinfo/${reportId}`, {
        method: 'GET',
        headers: { 'Authorization': `${token}` },
      });

      if (reportResponse.ok && apprsInfoResponse.ok) {
        const reportData = await reportResponse.json();
        const apprsInfoData = await apprsInfoResponse.json();

        setReportData(reportData);

        // 서버로부터 받은 데이터를 그대로 상태에 저장
        setApproverInfo(apprsInfoData.approverInfo || []);
        setRecipientInfo(apprsInfoData.recipientInfo || []);
        setReferenceInfo(apprsInfoData.referenceInfo || []);

        console.log('Report data:', reportData);
        console.log('Approver info:', apprsInfoData.approverInfo);
        console.log('Recipient info:', apprsInfoData.recipientInfo);
        console.log('Reference info:', apprsInfoData.referenceInfo);
      } else {
        console.error('Failed to fetch report or approver data');
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

    // printRef가 제대로 DOM 요소를 참조하는지 확인
    if (!element) {
      console.error('printRef가 올바른 DOM 요소를 참조하지 않습니다.');
      return;
    }

    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(reportData ? `${reportData.reportTitle}_기안_미리보기.pdf` : '기안_미리보기.pdf');
  };

  if (!reportData) return <p>Loading...</p>;

  // 결재 상신
  const handleSubmitForApproval = async () => {
    try {
      const token = localStorage.getItem('jwt'); // JWT 토큰 가져오기
      const apiUrl = `/api/submitApproval/${reportId}`; // 결재 상신 API 엔드포인트

      // API 요청을 위한 설정
      const response = await fetch(apiUrl, {
        method: 'POST', // 상신이므로 POST 요청
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId }), // 필요한 데이터 포함
      });

      // API 응답 처리
      if (response.ok) {
        const result = await response.json();
        console.log('Approval submitted successfully:', result);

        // 상신 성공 메시지 표시
        setAlertMessage('결재 상신이 완료되었습니다.');
        setShowModal(true);

        // 3초 후에 상세 페이지로 이동
        setTimeout(() => {
          setShowModal(false);
          navigate(`/company/user/draft/detail/work/${reportId}`);
        }, 3000);
      } else {
        // 오류 발생 시 처리
        const errorText = await response.text();
        console.error('Failed to submit for approval:', response.status, errorText);
        setAlertMessage('결재 상신에 실패했습니다.');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error submitting for approval:', error);
      setAlertMessage('결재 상신 중 오류가 발생했습니다.');
      setShowModal(true);
    }
  };

  return (
    <div className="container">
      <div className={styles.formHeader}>
        <h2 className={styles.pageTitle}>기안 미리보기</h2>
      </div>

      <div className={styles.backsection} ref={printRef}>
        <div className={styles.apprSumbitBtnBox}>
          <div>
            <Button className={styles.cancelBtn} onClick={handleCancel}>
              취소
            </Button>
          </div>
          <div>
            <Button className={styles.pdfBtn} onClick={handleDownloadPdf}>
              pdf 변환
            </Button>
            <Button className={styles.apprSumbitBtn} onClick={handleSubmitForApproval}>
              결재 상신
            </Button>
          </div>
        </div>

        {/* 모달 창 */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Body className="text-center">{alertMessage}</Modal.Body>
        </Modal>

        <div className={styles.contentsection}>
          {/* 메인 테이블 */}
          <Table
            bordered
            className={styles.mainTable}
            style={{ width: '800px', marginTop: '1px', borderCollapse: 'collapse' }}
          >
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
                <td className={styles.valueCellrepoTitle}>{reportData.reportTitle}</td>
              </tr>
            </tbody>
          </Table>

          <div className={styles.docInfoSection}>
            <Table bordered size="sm" className={styles.innerTable}>
              <tbody>
                <tr>
                  <td className={styles.labelCell}>문서번호</td>
                  <td className={styles.valueCell}>{reportData.repo_code}</td>
                </tr>

                {reportData.approverInfo && reportData.approverInfo.length > 0 && (
                  reportData.approverInfo.map((approver, index) => (
                      <tr key={index}>
                        <td className={styles.labelCell}>부&nbsp;&nbsp;&nbsp;서</td>
                        <td>{approver.dept_name}-{approver.dept_team_name}</td>
                      </tr>
                    ))
                  )}
                
                <tr>
                  <td className={styles.labelCell}>기&nbsp;안&nbsp;일</td>
                  <td className={styles.valueCell}>
                    {reportData.repo_date
                      ? moment(reportData.repo_date).format('YYYY-MM-DD')
                       : '날짜 없음'}
                  </td>
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

            <Table bordered size="sm" className={styles.innerApprTable}>
              <tbody className="apprLineTbody">
                <tr className="apprLinedocTr">
                  <td className={styles.valueCell}>상신</td>
                  {approverInfo.map((_, index) => (
                    <td key={index} className={styles.valueCell}>
                      결재
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className={styles.docValueAppr}>{reportData.emp_name}</td>
                  {approverInfo.map((approver, index) => (
                    <td key={index} className={styles.docValueAppr}>
                      <div style={{ position: 'relative' }}>
                        <div className={styles.apprTypePosi}>{approver.posi_name}</div>
                        {approver.emp_name}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className={styles.docValue_date}>
                    {reportData.repo_date
                      ? moment(reportData.repo_date).format('YYYY-MM-DD')
                      : ''}
                  </td>
                  {approverInfo.map((_, index) => (
                    <td key={index} className={styles.docValue_date}></td>
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
                  {referenceInfo.map((ref, index) => (
                    <span key={index}>
                      {ref.emp_name || ref.dept_team_name}
                      {index < referenceInfo.length - 1 && ', '}
                    </span>
                  ))}
                </td>
                <td className={styles.labelCellCol}>수&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;신</td>
                <td className={styles.valueCell}>
                  {recipientInfo.map((recv, index) => (
                    <span key={index}>
                      {recv.emp_name || recv.dept_team_name}
                      {index < recipientInfo.length - 1 && ', '}
                    </span>
                  ))}
                </td>
              </tr>
            </tbody>
          </Table>

          <Table bordered className={styles.secondaryTable}>
            <tbody>
              <tr>
                <td colSpan="4" className={styles.detailsTitle}>
                  상&nbsp;&nbsp;세&nbsp;&nbsp;내&nbsp;&nbsp;용
                </td>
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
                        <li key={index} className={styles.fileList}>
                          📄 {file.name}
                        </li>
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
