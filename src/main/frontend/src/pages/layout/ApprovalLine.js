import React, { useState } from 'react';
import { Modal, Button, Tabs, Tab, Table } from 'react-bootstrap';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from '../../styles/layout/ApprovalLine.module.css';
import OrgChart from '../layout/org_chart';

const ITEM_TYPE = 'row';

const DraggableRow = ({ person, index, moveRow, handleRemovePerson }) => {
  const [, ref] = useDrag({
    type: ITEM_TYPE,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <tr ref={(node) => ref(drop(node))} key={index}>
      <td>{person.headquarters}</td>
      <td>{person.department}</td>
      <td>{person.username}</td>
      <td>
        <Button variant="danger" size="sm" onClick={() => handleRemovePerson(index)}>
          삭제
        </Button>
      </td>
    </tr>
  );
};

const ApprovalLine = ({ showModal, handleModalClose }) => {
  const [activeTab, setActiveTab] = useState('approver');
  const [selectedApprovers, setSelectedApprovers] = useState([]); // 결재자 리스트
  const [selectedReferences, setSelectedReferences] = useState([]); // 참조자 리스트
  const [selectedReceivers, setSelectedReceivers] = useState([]); // 수신자 리스트

  const handleTabSelect = (tab) => setActiveTab(tab);

  const handleDragStart = (e, person) => {
    e.dataTransfer.setData('person', JSON.stringify(person));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const jsonData = event.dataTransfer.getData("person");

    if (jsonData) {
      try {
        const person = JSON.parse(jsonData);
        if (activeTab === 'approver') {
          setSelectedApprovers((prev) => [...prev, person]);
        } else if (activeTab === 'reference') {
          setSelectedReferences((prev) => [...prev, person]);
        } else if (activeTab === 'receiver') {
          setSelectedReceivers((prev) => [...prev, person]);
        }
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleRemovePerson = (index, type) => {
    if (type === 'approver') {
      setSelectedApprovers((prev) => prev.filter((_, i) => i !== index));
    } else if (type === 'reference') {
      setSelectedReferences((prev) => prev.filter((_, i) => i !== index));
    } else if (type === 'receiver') {
      setSelectedReceivers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const moveRow = (dragIndex, hoverIndex, type) => {
    const updatedList = (list) => {
      const dragItem = list[dragIndex];
      const updated = [...list];
      updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, dragItem);
      return updated;
    };

    if (type === 'approver') {
      setSelectedApprovers((prev) => updatedList(prev));
    } else if (type === 'reference') {
      setSelectedReferences((prev) => updatedList(prev));
    } else if (type === 'receiver') {
      setSelectedReceivers((prev) => updatedList(prev));
    }
  };

  const renderTable = (selectedPeople, type) => (
    <Table bordered striped className={styles.selectedPeopleTable}>
      <thead>
        <tr>
          <th>No</th>
          <th className={styles.headquarters}>부서 명</th>
          <th className={styles.department}>팀 명</th>
          <th className={styles.empUser}>직원 명</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {selectedPeople.map((person, index) => (
          <DraggableRow
            key={index}
            person={person}
            index={index}
            moveRow={(dragIndex, hoverIndex) => moveRow(dragIndex, hoverIndex, type)}
            handleRemovePerson={() => handleRemovePerson(index, type)}
          />
        ))}
      </tbody>
    </Table>
  );

  return (
    <Modal className={styles.apprModal} show={showModal} onHide={handleModalClose} size="lg" centered>
      <Modal.Header className={styles.apprModalHeader}>
        <Modal.Title className={styles.apprModalTitle}>결재선 등록</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.apprModalBody}>
        <DndProvider backend={HTML5Backend}>
          <div className={styles.orgChatList}>
            <Tabs activeKey={activeTab} onSelect={handleTabSelect} className={styles.apprTabs}>
              <Tab eventKey="approver" title="결재자" className={styles.apprTab}>
                <div className={styles.orgChartContainer}>
                  <div className={styles.orgChartList}>
                    <OrgChart onDragStart={handleDragStart} />
                  </div>
                  <div className={styles.apprTableContainer} onDrop={handleDrop} onDragOver={handleDragOver}>
                    {renderTable(selectedApprovers, 'approver')}
                  </div>
                </div>
              </Tab>
              <Tab eventKey="reference" title="참조자" className={styles.apprTab}>
                <div className={styles.orgChartContainer}>
                  <div className={styles.orgChartList}>
                    <OrgChart onDragStart={handleDragStart} />
                  </div>
                  <div className={styles.apprTableContainer} onDrop={handleDrop} onDragOver={handleDragOver}>
                    {renderTable(selectedReferences, 'reference')}
                  </div>
                </div>
              </Tab>
              <Tab eventKey="receiver" title="수신자" className={styles.apprTab}>
                <div className={styles.orgChartContainer}>
                  <div className={styles.orgChartList}>
                    <OrgChart onDragStart={handleDragStart} />
                  </div>
                  <div className={styles.apprTableContainer} onDrop={handleDrop} onDragOver={handleDragOver}>
                    {renderTable(selectedReceivers, 'receiver')}
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </DndProvider>
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
