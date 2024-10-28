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
    e.dataTransfer.setData('person', JSON.stringify(person)); // 드래그한 데이터를 저장
    console.log('Dragging:', person);
  };

  // 드롭할 때 호출되는 함수
  const handleDrop = (e) => {
    e.preventDefault();
    const person = JSON.parse(e.dataTransfer.getData('person')); // 드래그된 데이터 받아오기
    console.log('Dropped:', person);

    // 이미 선택된 사람이 있으면 추가하지 않음
    if (!selectedPeople.some(p => p.key === person.key)) {
      setSelectedPeople(prevPeople => [...prevPeople, person]); // 상태 업데이트
    }
  };

  // 드래그 오버(Drag Over) 이벤트를 처리하여 드롭을 허용
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 선택된 사람을 테이블에서 삭제하는 함수
  const handleRemovePerson = (index) => {
    setSelectedPeople(selectedPeople.filter((_, i) => i !== index));
  };

  return (
    <Modal className={styles.apprModal} show={showModal} onHide={handleModalClose} size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header className={styles.apprModalHeader}>
        <Modal.Title className={styles.apprModalTitle}>결재선 등록</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.apprModalBody}>
        <div className={styles.orgChatList}>
          <Tabs activeKey={activeTab} onSelect={handleTabSelect} className={styles.apprTabs}>
            {/* 결재자 탭 */}
            <Tab eventKey="approver" title="결재자" className={styles.apprTab}>
              <div className={styles.orgChartContainer}>
                <div className={styles.orgChartList} >
                  <OrgChart
                    onDragStart={(e, person) => handleDragStart(e, person)} // person passed from OrgChart
                  />
                </div>

                <div className={styles.apprTableContainer}
                onDrop={handleDrop} // 드롭 이벤트 처리
                onDragOver={handleDragOver} // 드래그 오버 처리
                >

                  <div className={styles.selectedPeopleContainer}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <Table bordered striped className={styles.selectedPeopleTable}>
                      <thead>
                        <tr>
                          <th className={styles.headquarters}>본부</th>
                          <th className={styles.department}>부서</th>
                          <th className={styles.empUser}>직원명</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPeople.map((person, index) => (
                          <tr key={index}>
                            <td>{person.headquarters}</td>
                            <td>{person.department}</td>
                            <td>{person.username}</td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleRemovePerson(index)}
                              >
                                삭제
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </Tab>

            {/* 참조자 탭 */}
            <Tab eventKey="reference" title="참조자" className={styles.apprTab}>
            <div className={styles.orgChartContainer}>
                <div className={styles.orgChartList} >
                  <OrgChart
                    onDragStart={(e, person) => handleDragStart(e, person)} // person passed from OrgChart
                  />
                </div>

                <div className={styles.apprTableContainer}
                onDrop={handleDrop} // 드롭 이벤트 처리
                onDragOver={handleDragOver} // 드래그 오버 처리
                >

                  <div className={styles.selectedPeopleContainer}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <Table bordered striped className={styles.selectedPeopleTable}>
                      <thead>
                        <tr>
                          <th className={styles.headquarters}>소속 부서</th>
                          <th className={styles.department}>소속 팀</th>
                          <th className={styles.empUser}>직원명</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPeople.map((person, index) => (
                          <tr key={index}>
                            <td>{person.headquarters}</td>
                            <td>{person.department}</td>
                            <td>{person.username}</td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleRemovePerson(index)}
                              >
                                삭제
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </Tab>

            {/* 수신자 탭 */}
            <Tab eventKey="receiver" title="수신자" className={styles.apprTab}>
            <div className={styles.orgChartContainer}>
                <div className={styles.orgChartList} >
                  <OrgChart
                    onDragStart={(e, person) => handleDragStart(e, person)} // person passed from OrgChart
                  />
                </div>

                <div className={styles.apprTableContainer}
                onDrop={handleDrop} // 드롭 이벤트 처리
                onDragOver={handleDragOver} // 드래그 오버 처리
                >

                  <div className={styles.selectedPeopleContainer}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <Table bordered striped className={styles.selectedPeopleTable}>
                      <thead>
                        <tr>
                          <th className={styles.headquarters}>본부</th>
                          <th className={styles.department}>부서</th>
                          <th className={styles.empUser}>직원명</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPeople.map((person, index) => (
                          <tr key={index}>
                            <td>{person.headquarters}</td>
                            <td>{person.department}</td>
                            <td>{person.username}</td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleRemovePerson(index)}
                              >
                                삭제
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
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
