import React, { useEffect, useState } from 'react';
import { useLocation , useParams } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import styles from '../../styles/company/company_draft_appr_detail_work.module.css';
import moment from 'moment';

const CompanyUserDraftApprDetailWork = () => {
  const { reportId } = useParams(); // URL에서 reportId를 가져옴
  const [reportData, setReportData] = useState(null);

  const location = useLocation();
  const [reportStatus, setReportStatus] = useState('');
  const [repoStartTime, setRepoStartTime] = useState('');
  const [repoEndTime, setRepoEndTime] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [selectedApprovers, setSelectedApprovers] = useState([]);
  const [selectedReferences, setSelectedReferences] = useState([]);
  const [selectedReceivers, setSelectedReceivers] = useState([]);

  useEffect(() => {
    if (reportId) {
      // reportId를 사용하여 데이터 요청
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/report/${reportId}`);
          const data = await response.json();
          setReportData(data);
        } catch (error) {
          console.error('Error fetching report data:', error);
        }
      };
      fetchData();
    }
  }, [reportId])

  return (
    <div className="container">
      <div className={styles.formHeader}>
        <h2 className={styles.pageTitle}>결재 문서</h2>
      </div>

      <div className={styles.formContent}>
        <div className={styles.apprSumbitBtnBox}>
          <Button className={styles.rejectBtn}>반려</Button>
          <Button className={styles.approveBtn}>승인</Button>
        </div>

        <Table bordered className={styles.mainTable}>
          <tbody>
            <tr>
              <td className={styles.labelCellTitle}>기안 제목</td>
              <td className={styles.valueCell} colSpan="3">
                {/* {reportTitle} */}
                </td>
            </tr>
          </tbody>
        </Table>

        <div className={styles.docInfoSection}>
          {/* 문서 정보 테이블 */}
          <Table bordered size="sm" className={styles.innerTable}>
            <tbody>
              <tr>
                <td className={styles.labelCelldoc}>문서번호</td>
                <td className={styles.valueCell}></td>
              </tr>
              <tr>
                <td className={styles.labelCelldoc}>부&nbsp;&nbsp;&nbsp;서</td>
                <td className={styles.valueCell}>
                  {/* {department} */}
                  </td>
              </tr>
              <tr>
                <td className={styles.labelCelldoc}>기&nbsp;안&nbsp;일</td>
                <td className={styles.valueCell}>
                  {/* {moment(reportDate, "YYYY. MM. DD. A hh:mm").format("YYYY-MM-DD")} */}
                </td>
              </tr>
              <tr>
                <td className={styles.labelCelldoc}>기 안 자</td>
                <td className={styles.valueCell}>
                  {/* {reporter} */}
                  </td>
              </tr>
              <tr>
                <td className={styles.labelCelldoc}>시행일자</td>
                <td className={styles.valueCell}>
                  {/* {repoStartTime} */}
                  </td>
              </tr>
              <tr>
                <td className={styles.labelCelldoc}>마감일자</td>
                <td className={styles.valueCell}>
                  {/* {repoEndTime} */}
                  </td>
              </tr>
            </tbody>
          </Table>

          {/* 결재선 테이블 */}
          <Table bordered size="sm" className={styles.innerApprTable}>
            <tbody className="apprLineTbody">
              <tr className="apprLinedocTr">
                <td className={styles.valueCellAppr}>상신</td>
                {selectedApprovers.map((_, index) => (
                  <td key={index} className={styles.valueCellAppr}>결재</td>
                ))}
              </tr>

              <tr>
                <td className={styles.docValueAppr}>
                  {/* {reporter} */}
                  </td>
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
                  {/* {reportDate} */}
                </td>
                {selectedApprovers.map((_, index) => (
                  <td key={index} className={styles.docValue_date}>

                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
        </div>

        {/* 기타 정보 테이블 */}
        <Table bordered className={styles.secondaryTable}>
          <tbody>
            <tr>
              <td className={styles.labelCellSec}>참&nbsp;&nbsp;&nbsp;조</td>
              <td className={styles.valueCell}>
                {selectedReferences.map((ref, index) => (
                  <span key={index}>{ref.emp_name}{index < selectedReferences.length - 1 && ', '}</span>
                ))}
              </td>
              <td className={styles.labelCellSec}>수&nbsp;&nbsp;&nbsp;신</td>
              <td className={styles.valueCell}>
                {selectedReceivers.map((recv, index) => (
                  <span key={index}>{recv.emp_name}{index < selectedReceivers.length - 1 && ', '}</span>
                ))}
              </td>
            </tr>
          </tbody>
        </Table>

        {/* 내용 테이블 */}
        <Table bordered className={styles.secondaryTable}>
          <tbody>
            {/* <tr>
              <td colSpan="4" className={styles.detailsTitle}>상세 내용</td>
            </tr> */}
            <tr>
              <td colSpan="4" className={styles.valueCellContent}>
                {/* {reportContent}, */}
              </td>
            </tr>
          </tbody>
        </Table>

        {/* 파일 첨부 테이블 */}
        <Table bordered>
          <tbody>
            <tr>
              <td colSpan="4" className={styles.labelCellFile}>첨부 파일</td>
            </tr>
            <tr>
              <td colSpan="4" className={styles.valueCellFile}>
                {/* {files.length > 0 ? (
                  <ul>
                    {files.map((file, index) => (
                      <li key={index} className={styles.fileList}>📄 {file}</li>
                    ))}
                  </ul>
                ) : (
                  '첨부된 파일이 없습니다.'
                )} */}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default CompanyUserDraftApprDetailWork;