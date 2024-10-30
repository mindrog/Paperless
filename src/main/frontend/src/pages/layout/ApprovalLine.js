import React, { useState, useEffect } from 'react';
import { Modal, Button, Tabs, Tab, Table, Form } from 'react-bootstrap';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from '../../styles/layout/ApprovalLine.module.css';
import OrgChart from '../layout/org_chart';

const ITEM_TYPE = 'row';

const DraggableRow = ({ person, index, moveRow, handleRemovePerson, handleSelectChange }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { data: person, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
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

  const dragDropRef = React.useRef(null);
  drag(drop(dragDropRef));

  return (
    <tr ref={dragDropRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <td>{index + 1}</td>
      <td>{person.dept_name || person.deptName}</td>
      <td>{person.dept_team_name || person.teamName}</td>
      <td>{person.emp_name || ""}</td>
      <td>
        <Form.Select aria-label="Default select example" value={person.approvalType || ''}
          onChange={(e) => handleSelectChange(index, e.target.value)}>
          <option value="">선택</option>
          <option value="전결">전결</option>
          <option value="대결">대결</option>
          <option value="결재">결재</option>
        </Form.Select>
      </td>
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
  const [selectedApprovers, setSelectedApprovers] = useState([]);
  const [selectedReferences, setSelectedReferences] = useState([]);
  const [selectedReceivers, setSelectedReceivers] = useState([]);

  useEffect(() => {
    if (!showModal) {
      setSelectedApprovers([]);
      setSelectedReferences([]);
      setSelectedReceivers([]);
    }
  }, [showModal]);

  const handleTabSelect = (tab) => setActiveTab(tab);

  const handleDrop = (item) => {
    console.log("handleDrop 호출!!");

    const { data, type } = item;

    // activeTab에 따라 선택된 리스트에 드래그된 항목 추가
    if (type === 'employee') {
        if (activeTab === 'approver') {
            setSelectedApprovers((prev) => [...prev, { ...data, approvalType: '' }]);
        } else if (activeTab === 'reference') {
            setSelectedReferences((prev) => [...prev, { ...data, approvalType: '' }]);
        } else if (activeTab === 'receiver') {
            setSelectedReceivers((prev) => [...prev, { ...data, approvalType: '' }]);
        }
    }
    // 부서나 팀의 전체 직원 추가 로직이 있는 경우도 조건을 제거하고 무조건 추가하게 합니다.
    else if (type === 'department') {
        const departmentMembers = data.teams.flatMap((team) =>
            team.members.map((member) => ({ ...member, dept_name: data.deptName, approvalType: '' }))
        );

        if (activeTab === 'approver') {
            setSelectedApprovers((prev) => [...prev, ...departmentMembers]);
        } else if (activeTab === 'reference') {
            setSelectedReferences((prev) => [...prev, ...departmentMembers]);
        } else if (activeTab === 'receiver') {
            setSelectedReceivers((prev) => [...prev, ...departmentMembers]);
        }
    }
  };

  const handleRemovePerson = (index, type) => {
    if (type === 'approver') {
      setSelectedApprovers((prev) => prev.filter((_, i) => i !== index));
    } else if (type === 'reference') {
      setSelectedReferences((prev) => prev.filter((_, i) => i !== index));
    } else if (type === 'receiver') {
      setSelectedReceivers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSelectChange = (index, value, type) => {
    const updateList = (list) =>
      list.map((item, idx) => (idx === index ? { ...item, approvalType: value } : item));

    if (type === 'approver') {
      setSelectedApprovers((prev) => updateList(prev));
    } else if (type === 'reference') {
      setSelectedReferences((prev) => updateList(prev));
    } else if (type === 'receiver') {
      setSelectedReceivers((prev) => updateList(prev));
    }
  };

  const moveRow = (dragIndex, hoverIndex, type) => {
    const updateList = (list) => {
      const updated = [...list];
      const dragItem = updated.splice(dragIndex, 1)[0];
      updated.splice(hoverIndex, 0, dragItem);
      return updated;
    };

    if (type === 'approver') {
      setSelectedApprovers((prev) => updateList(prev));
    } else if (type === 'reference') {
      setSelectedReferences((prev) => updateList(prev));
    } else if (type === 'receiver') {
      setSelectedReceivers((prev) => updateList(prev));
    }
  };

  const renderTable = (selectedPeople, type) => (
    <Table bordered striped className={styles.selectedPeopleTable}>
      <thead>
        <tr>
          <th>No</th>
          <th>부서 명</th>
          <th>팀 명</th>
          <th>직원 명</th>
          <th>결재 유형</th>
          <th>작업</th>
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
            handleSelectChange={(idx, value) => handleSelectChange(idx, value, type)}
          />
        ))}
      </tbody>
    </Table>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Modal
        className={styles.apprModal}
        show={showModal}
        onHide={handleModalClose}
        size="lg"
        centered
      >
        <Modal.Header className={styles.apprModalHeader}>
          <Modal.Title className={styles.apprModalTitle}>결재선 등록</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.apprModalBody}>
          <div className={styles.orgChatList}>
            <Tabs activeKey={activeTab} onSelect={handleTabSelect} className={styles.apprTabs}>
              <Tab eventKey="approver" title="결재자" className={styles.apprTab}>
                <div className={styles.orgChartContainer}>
                  <div className={styles.orgChartList}>
                    <OrgChart showModal={showModal} />
                  </div>
                  <div className={styles.apprTableContainer}>
                    {renderTable(selectedApprovers, 'approver')}
                  </div>
                </div>
              </Tab>
              <Tab eventKey="reference" title="참조자" className={styles.apprTab}>
                <div className={styles.orgChartContainer}>
                  <div className={styles.orgChartList}>
                    <OrgChart showModal={showModal} />
                  </div>
                  <div className={styles.apprTableContainer}>
                    {renderTable(selectedReferences, 'reference')}
                  </div>
                </div>
              </Tab>
              <Tab eventKey="receiver" title="수신자" className={styles.apprTab}>
                <div className={styles.orgChartContainer}>
                  <div className={styles.orgChartList}>
                    <OrgChart showModal={showModal} />
                  </div>
                  <div className={styles.apprTableContainer}>
                    {renderTable(selectedReceivers, 'receiver')}
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
    </DndProvider>
  );
};

export default ApprovalLine;
