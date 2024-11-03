import React, { useState } from 'react';
import { Modal, Button, Tabs, Tab, Table, Form } from 'react-bootstrap';
import { useDrag, useDrop } from 'react-dnd';
import styles from '../../styles/layout/ApprovalLine.module.css';
import OrgChart from '../layout/org_chart';

const ITEM_TYPE = 'ITEM';

const DraggableRow = ({ person, index, moveRow, handleRemovePerson, handleSelectChange, rowClass, showApprovalType }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { data: person, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const dragDropRef = React.useRef(null);
  drag(drop(dragDropRef));

  return (
    <tr ref={dragDropRef} className={rowClass} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <td>{index + 1}</td>
      <td>{person.dept_name || person.deptName}</td>
      <td>{person.dept_team_name || person.teamName || "-"}</td>
      <td>{person.posi_name || "-"}</td> 
      <td>{person.emp_name || "-"}</td>
      {showApprovalType && (
        <td>
          <Form.Select
            aria-label="Default select example"
            value={person.approvalType || ''}
            onChange={(e) => handleSelectChange(index, e.target.value)}
          >
            <option value="">선택</option>
            <option value="전결">전결</option>
            <option value="대결">대결</option>
            <option value="결재">결재</option>
          </Form.Select>
        </td>
      )}
      <td>
        <Button variant="danger" size="sm" onClick={() => handleRemovePerson(index)}>
          삭제
        </Button>
      </td>
    </tr>
  );
};

const ApprovalLine = ({ showModal, handleModalClose, selectedApprovers,
  setSelectedApprovers,
  selectedReferences,
  setSelectedReferences,
  selectedReceivers,
  setSelectedReceivers }) => {
  const [activeTab, setActiveTab] = useState('approver');

  // 콘솔
  console.log("Selected References:", selectedReferences); // dept_code 포함 여부 확인
  console.log("Selected Receivers:", selectedReceivers);   // dept_code 포함 여부 확인

  const handleTabSelect = (tab) => setActiveTab(tab);

  const updateList = (prevList, data) => {
    const isDuplicate = prevList.some((entry) => {
      if (data.emp_name) {
        return entry.emp_name === data.emp_name;
      } else if (data.team_name) {
        return entry.team_name === data.team_name;
      } else if (data.dept_name) {
        return entry.dept_name === data.dept_name;
      }
      return false;
    });

    if (!isDuplicate) {
      const newItem = {
        ...data,
        type: data.emp_name ? 'person' : data.team_name ? 'team' : 'department',
        team_name: data.team_name || '',
        dept_name: data.dept_name || '',
        dept_code: data.dept_code || '',
      };
      return [...prevList, newItem];
    }
    return prevList;
  };

  const [{ isOverApprover }, dropApprover] = useDrop({
    accept: ITEM_TYPE,
    drop: (item) => setSelectedApprovers((prev) => updateList(prev, item.data)),
    collect: (monitor) => ({
      isOverApprover: monitor.isOver(),
    }),
  });

  const [{ isOverReference }, dropReference] = useDrop({
    accept: ITEM_TYPE,
    drop: (item) => setSelectedReferences((prev) => updateList(prev, item.data)),
    collect: (monitor) => ({
      isOverReference: monitor.isOver(),
    }),
  });

  const [{ isOverReceiver }, dropReceiver] = useDrop({
    accept: ITEM_TYPE,
    drop: (item) => setSelectedReceivers((prev) => updateList(prev, item.data)),
    collect: (monitor) => ({
      isOverReceiver: monitor.isOver(),
    }),
  });

  const handleRemovePerson = (index, type) => {
    if (type === 'approver') {
      setSelectedApprovers((prev) => prev.filter((_, i) => i !== index));
    } else if (type === 'reference') {
      setSelectedReferences((prev) => prev.filter((_, i) => i !== index));
    } else if (type === 'receiver') {
      setSelectedReceivers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSelectChange = (index, value) => {
    setSelectedApprovers((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, approvalType: value } : item))
    );
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



  const renderTable = (selectedPeople = [], type) => (
    <Table className={styles.selectedPeopleTable} bordered striped>
      <thead>
        <tr>
          <th>No</th>
          <th>부서 명</th>
          <th>팀 명</th>
          <th>직 급</th>
          <th>직원 명</th>
          {type === 'approver' && <th>결재 유형</th>}
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
            handleSelectChange={(idx, value) => handleSelectChange(idx, value)}
            rowClass={styles.selectedRow}
            showApprovalType={type === 'approver'}
          />
        ))}
      </tbody>
    </Table>
  );

  return (
    <Modal show={showModal} onHide={handleModalClose} size="lg" centered>
      <Modal.Header className={styles.apprModalHeader}>
        <Modal.Title>결재선 등록</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs activeKey={activeTab} onSelect={handleTabSelect} className={styles.apprTabs}>
          <Tab eventKey="approver" title="결재자">
            <div className={styles.orgChartContainer}>
              <div className={styles.orgChartList}>
                <OrgChart enableDrag={true} />
              </div>
              <div
                ref={dropApprover}
                className={`${styles.apprTableContainer} ${isOverApprover ? styles.highlight : ''}`}
              >
                {renderTable(selectedApprovers, 'approver')}
                {isOverApprover && <p>추가하기</p>}
              </div>
            </div>
          </Tab>
          <Tab eventKey="reference" title="참조자">
            <div className={styles.orgChartContainer}>
              <div className={styles.orgChartList}>
                <OrgChart enableDrag={true} />
              </div>
              <div
                ref={dropReference}
                className={`${styles.apprTableContainer} ${isOverReference ? styles.highlight : ''}`}
              >
                {renderTable(selectedReferences, 'reference')}
                {isOverReference && <p>추가하기</p>}
              </div>
            </div>
          </Tab>
          <Tab eventKey="receiver" title="수신자">
            <div className={styles.orgChartContainer}>
              <div className={styles.orgChartList}>
                <OrgChart enableDrag={true} />
              </div>
              <div
                ref={dropReceiver}
                className={`${styles.apprTableContainer} ${isOverReceiver ? styles.highlight : ''}`}
              >
                {renderTable(selectedReceivers, 'receiver')}
                {isOverReceiver && <p>추가하기</p>}
              </div>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleModalClose(false)}>
          확인
        </Button>
        <Button variant="secondary" onClick={() => handleModalClose(true)}>
          취소
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ApprovalLine;