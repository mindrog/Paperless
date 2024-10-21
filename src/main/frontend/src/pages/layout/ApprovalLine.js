import React, { useState } from 'react';
import { Modal, Button, Tabs, Tab, Table } from 'react-bootstrap';
import styles from '../../styles/layout/ApprovalLine.module.css';
import OrgChart from '../layout/org_chart';

const ApprovalLine = ({ showModal, handleModalClose }) => {
  const [activeTab, setActiveTab] = useState('approver');
  const [selectedPeople, setSelectedPeople] = useState([]); // 선택된 사람들의 리스트

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  // 드래그 시작 시 호출되는 함수
  const handleDragStart = (e, person) => {
    e.dataTransfer.setData('person', JSON.stringify(person)); // 드래그한 사람의 데이터를 저장
  };

  // 드롭할 때 호출되는 함수
  const handleDrop = (e) => {
    e.preventDefault();
    const person = JSON.parse(e.dataTransfer.getData('person')); // 드래그된 데이터 받아오기
    setSelectedPeople((prevPeople) => [...prevPeople, person]); // 선택된 사람 목록에 추가
  };

  // 드래그 오버(Drag Over) 이벤트를 처리하여 드롭을 허용
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Modal show={showModal} onHide={handleModalClose} centered>
      <Modal.Header className={styles.apprModalHeader}>
        <Modal.Title className={styles.apprModalTitle}>결재선 / 참조자 / 수신자 등록</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.apprModalBody}>
        <div className={styles.orgChatList}>
          <Tabs activeKey={activeTab} onSelect={handleTabSelect} className={styles.apprTabs}>
            {/* 결재자 탭 */}
            <Tab eventKey="approver" title="결재자" className={styles.apprTab}>
              <div className={styles.orgChartContainer}>
                <div className={styles.orfChartList}>
                  <OrgChart onDragStart={handleDragStart} />
                </div>
                
                <div className={styles.selectedPeopleContainer}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <Table striped size="sm" className={styles.selectedPeopleTable}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </Tab>

            {/* 참조자 탭 */}
            <Tab eventKey="reference" title="참조자" className={styles.apprTab}>
              <div className={styles.orgChartContainer}>
                <OrgChart onDragStart={handleDragStart} />
              </div>
            </Tab>

            {/* 수신자 탭 */}
            <Tab eventKey="receiver" title="수신자" className={styles.apprTab}>
              <div className={styles.orgChartContainer}>
                <OrgChart onDragStart={handleDragStart} />
              </div>
            </Tab>
          </Tabs>
        </div>
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
