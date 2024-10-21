import React, { useState } from 'react';
import { Modal, Button, Tabs, Tab } from 'react-bootstrap';
import styles from '../../styles/layout/ApprovalLine.module.css'; 
import OrgChart from '../layout/org_chart';

const ApprovalLine = ({ showModal, handleModalClose }) => {
    const [activeTab, setActiveTab] = useState('approver');
  
    const handleTabSelect = (tab) => {
      setActiveTab(tab);
    };

    return (
        <Modal show={showModal} onHide={handleModalClose} centered>
          <Modal.Header className={styles.apprModalHeader}>
            <Modal.Title className={styles.apprModalTitle}>결재선 / 참조자 / 수신자 등록</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={handleTabSelect}
              className={styles.apprTabs}
            >
              {/* 결재자 탭 */}
              <Tab eventKey="approver" title="결재자" className={styles.apprTab}>
                <div className={styles.orgChartContainer}>
                  <OrgChart />
                </div>
              </Tab>
    
              {/* 참조자 탭 */}
              <Tab eventKey="reference" title="참조자" className={styles.apprTab}>
                <div className={styles.orgChartContainer}>
                  <OrgChart />
                </div>
              </Tab>
    
              {/* 수신자 탭 */}
              <Tab eventKey="receiver" title="수신자" className={styles.apprTab}>
                <div className={styles.orgChartContainer}>
                  <OrgChart />
                </div>
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer className={styles.apprModalFooter}>
            <Button variant="primary" onClick={handleModalClose} className={styles.modalSaveBtn}>
              확인
            </Button>
            <Button variant="secondary" onClick={handleModalClose} className={styles.modalCancelBtn}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>
      );
    };

export default ApprovalLine;