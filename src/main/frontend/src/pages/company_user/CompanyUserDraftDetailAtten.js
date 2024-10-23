import React, { useState } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import styles from '../../styles/company/company_draft_write_work.module.css';
import style_atten from '../../styles/company/company_draft_write_atten.module.css';

function CompanyUserDraftDetailWork() {
  const [reportTitle, setReportTitle] = useState('');
  const [reporter, setReporter] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [department, setDepartment] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // 결재 상태
  const [appr_status, setApprStatus] = useState("pending"); 

  const [vacationType, setVacationType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [annualLeaveDays, setAnnualLeaveDays] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDateChange = (e, type) => {
    if (type === 'start') {
      setStartDate(e.target.value);
    } else if (type === 'end') {
      setEndDate(e.target.value);
    }
  };

  return (
    <div>
      <div className="container">
      <div className={styles.apprSumbitBtnBox}>
          <h2 className={styles.pageTitle}>근태 기안 상세</h2>
          <div>
            <Button className={styles.SumbitCancelBtn} disabled={appr_status !== "pending"}>상신 취소</Button>
          </div>
          <div>
            <Button className={styles.WithdrawBtn} disabled={appr_status === "pending"}>회신</Button>
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
              {/* 휴가 종류 드롭다운 */}
              <tr>
                <td className={styles.docKey}>휴가종류</td>
                <td colSpan={3}>
                  <Form.Select
                    value={vacationType}
                    onChange={(e) => setVacationType(e.target.value)}
                    className={style_atten.inputForm}
                    defaultValue={"선택"}
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
                  &nbsp;~&nbsp;
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => handleDateChange(e, 'end')}
                    className={style_atten.inputFormDate}
                  />
                </td>
                {errorMessage && <Alert variant="danger" className={style_atten.errorMessage}>{errorMessage}</Alert>}

                {/* 연차 일수: 자동 계산 */}
                <td className={styles.docKey}>연차 일수</td>
                <td>
                  <Form.Control
                    type="number"
                    value={annualLeaveDays}
                    readOnly
                    className={styles.inputForm}
                  />
                </td>
              </tr>

              {/* 휴가 사유 */}
              <tr>
                <td className={styles.docKey}>휴가 사유</td>
                <td colSpan={3}>
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
                      연차의 사용은 근로기준법에 따라 전년도에 발생한 개인별 잔여 연차에 한하여 사용함을 원칙으로 지정함.
                    </li>
                    <li>
                      경조사 휴가는 행사일을 증명할 수 있는 가족 관계 증명서 또는 등본, 청첩장 등 제출 필요함.
                    </li>
                    <li>
                      공가(예비군/민방위)는 사전에 통지서를, 사후에 참석증을 반드시 제출 필요함.
                    </li>
                  </ol>
                </td>
              </tr>
            </tbody>
          </Table>
        </Form>
      </div>
    </div>
  );
}

export default CompanyUserDraftDetailWork;
