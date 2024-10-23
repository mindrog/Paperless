import React, { useState } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/company/company_draft_write_work.module.css';
import ApprovalLine from '../layout/ApprovalLine';

function CompanyUserDraftDetailAtten() {
  const [reportTitle, setReportTitle] = useState('');
  const [reporter, setReporter] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [department, setDepartment] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // 결재 상태
  const [appr_status, setApprStatus] = useState("wait"); 
  
  return (
    <div>
      <div className="container">
        <div className={styles.apprSumbitBtnBox}>
          <h2 className={styles.pageTitle}>업무 보고 기안 상세</h2>
          <div>
            <Button className={styles.SumbitCancelBtn} disabled={appr_status !== "wait"}>상신 취소</Button>
          </div>
          <div>
            <Button className={styles.WithdrawBtn} disabled={appr_status === "wait"}>회신</Button>
          </div>
        </div>
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
                    readOnly
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
                  <td className={styles.docKey}>시행일자</td>
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
                    {/* <Button className={styles.cancelBtn} onClick={handleApprLineModal}>결재선 지정</Button> */}
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
              <tr>
                <td className={styles.docKey}>수 &nbsp;&nbsp;&nbsp; 신</td>
                <td></td>
                <td className={styles.docKey}>참 &nbsp;&nbsp;&nbsp; 조</td>
                <td></td>
              </tr>
              <tr>
                <td className={styles.docKey}>제 &nbsp;&nbsp;&nbsp; 목</td>
                <td colSpan={3}>
                  <Form.Control
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className={`${styles.inputForm} ${formErrors.reportTitle ? styles.errorInput : ''}`}
                    placeholder="문서 제목을 입력하세요"
                    readOnly
                  />
                  {formErrors.reportTitle && <span className={styles.errorMessage}>문서 제목을 입력해주세요</span>}
                </td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    className={`${styles.inputForm} ${formErrors.reportContent ? styles.errorInput : ''}`}
                    placeholder="내용을 입력하세요"
                    readOnly
                  />
                  {formErrors.reportContent && <span className={styles.errorMessage}>내용을 입력해주세요</span>}
                </td>
              </tr>
              <tr>
                <td colSpan={4} className={styles.docKey}>첨부자료</td>
              </tr>
              <tr>
                <td className={styles.docKey}>첨부자료</td>
                <td
                  colSpan={5}
                  className={styles.dropZone}
                >
                  파일을 여기에 드롭하거나 클릭하여 추가하세요
                </td>
              </tr>
            </tbody>
          </Table>
        </Form>
      </div>
    </div>
  );
}

export default CompanyUserDraftDetailAtten;
