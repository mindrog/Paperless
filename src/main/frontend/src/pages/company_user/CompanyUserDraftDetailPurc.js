import React, { useState } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import styles from '../../styles/company/company_draft_write_work.module.css';
import style_purc from '../../styles/company/company_draft_write_purc.module.css';

function CompanyUserDraftDetailPurc() {
  const [reportTitle, setReportTitle] = useState('');
  const [reporter, setReporter] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [department, setDepartment] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [approvals, setApprovals] = useState([{ name: '', position: '' }]);
  const [files, setFiles] = useState([]); // For file handling

  // Fixing missing variables
  const [rows, setRows] = useState([
    { productName: '', specification: '', quantity: 0, unitPrice: 0, totalPrice: 0, note: '' }
  ]);
  const [formErrors, setFormErrors] = useState({}); // Fix for form validation errors
  const readOnly = false; // Set as needed, can be conditionally set

  // Function to handle row change
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    updatedRows[index].totalPrice = updatedRows[index].quantity * updatedRows[index].unitPrice;
    setRows(updatedRows);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    // handle file drop logic here
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  return (
    <div>
      <div className="container">
        <div className={styles.apprSumbitBtnBox}>
          <h2 className={styles.pageTitle}>구매 신청 기안 상세</h2>
          <div>
            <Button>상신 취소</Button>
          </div>
          <div>
            <Button>회신</Button>
          </div>
        </div>
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
            {/* Table for Document Info */}
            {/* Add your table and other elements here */}
          </div>

          {/* 구매 내용 입력 */}
          <Table bordered className={style_purc.docContent}>
            <thead>
              <tr>
                <th className={style_purc.productName}>품명</th>
                <th className={style_purc.productSize}>규격</th>
                <th className={style_purc.productCount}>수량</th>
                <th className={style_purc.productPrice}>단가</th>
                <th className={style_purc.productPrices}>금액</th>
                <th className={style_purc.productEtc}>비고</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <Form.Control
                      type="text"
                      value={row.productName}
                      onChange={(e) => handleRowChange(index, 'productName', e.target.value)}
                      className={styles.inputForm}
                      disabled={readOnly} // Disable input when in read-only mode
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      value={row.specification}
                      onChange={(e) => handleRowChange(index, 'specification', e.target.value)}
                      className={styles.inputForm}
                      disabled={readOnly} // Disable input when in read-only mode
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={row.quantity}
                      onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
                      className={styles.inputForm}
                      disabled={readOnly} // Disable input when in read-only mode
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={row.unitPrice}
                      onChange={(e) => handleRowChange(index, 'unitPrice', e.target.value)}
                      className={styles.inputForm}
                      disabled={readOnly} // Disable input when in read-only mode
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
                      disabled={readOnly} // Disable input when in read-only mode
                    />
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => handleRemoveRow(index)} disabled={readOnly}>
                      -
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Form>
      </div>
    </div>
  );
}

export default CompanyUserDraftDetailPurc;
