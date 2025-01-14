import React from 'react';
import { Table, Button } from 'react-bootstrap';
import styles from '../../../styles/company/company_draft_write_work.module.css';

const ApprovalLineTable = ({ handleApprLineModal, reporter, approvers, posiName }) => {
  // approvers 데이터 콘솔 출력
  console.log("Approvers Data:", approvers);
  return (
    <Table bordered size="sm" className={styles.apprLineBox}>
      <tbody className={styles.apprLineTbody}>
        {/* 상신 및 결재 헤더 */}
        <tr className={styles.apprLinedocTr}>
          <td className={styles.docKeyAppr}>상신</td>
          <td className={styles.docKeyAppr}>결재</td>
          {approvers.map((_, index) => (
            <td key={index} className={styles.docKeyAppr}>결재</td>
          ))}
        </tr>

        {/* 상신자 및 결재자 정보 */}
        <tr>
          <td className={styles.docValueAppr}>
            <div>
            {posiName && <div className={styles.apprTypePosi}>{posiName}</div>}
            {reporter}
            </div>
          </td>
          {approvers.map((approver, index) => (
            <td key={index} className={styles.docValueAppr}>
              <div style={{ position: 'relative' }}>
                {approver.posi_name && <div className={styles.apprTypePosi}>{approver.posi_name}</div>}
                {approver.type === 'person' && approver.emp_name}
                {approver.type === 'department' && (
                  <>
                    {approver.teamName || approver.deptName}
                  </>
                )}
                {approver.approvalType && <div className={styles.apprType}>({approver.approvalType})</div>}
              </div>
            </td>
          ))}
          <td className={styles.docValueAppr}>
            <Button className={styles.apprLineBtn} onClick={handleApprLineModal}>결재선</Button>
          </td>
        </tr>

        {/* 결재일자 행 */}
        <tr>
          <td className={styles.docValue_date}></td>
          {approvers.map((_, index) => (
            <td key={index}></td>
          ))}
          <td></td>
        </tr>
      </tbody>
    </Table>
  );
};

export default ApprovalLineTable;
