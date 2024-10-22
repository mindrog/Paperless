import React, { useState } from 'react'
import { Table, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import styles from '../../styles/company/admin/company_member.module.css'; // Reuse the existing CSS for consistency
import Menubar from '../layout/menubar';

function CompanyUserStock() {
  const [showAddModal, setShowAddModal] = useState(false); // Add inventory modal state
  const [showEditModal, setShowEditModal] = useState(false); // Edit inventory modal state
  const [selectedItem, setSelectedItem] = useState(null); // Selected item for editing
  const [category, setCategory] = useState(''); // Inventory category state management

  // Inventory data (sample)
  const inventoryData = [
    { id: 1, name: "Item 1", category: "Electronics", quantity: 50, price: 100 },
    { id: 2, name: "Item 2", category: "Office Supplies", quantity: 30, price: 20 }
  ];

  // Modal handling
  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowEditModal = (item) => {
    setSelectedItem(item); // Set selected item for editing
    setCategory(item.category); // Set the category state to the item's category
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  // Form submission handling
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle add/edit logic here
    handleCloseAddModal();
    handleCloseEditModal();
  };

  return (
    <div>
      <div className="container-xl">
        <Menubar />

        <div className={styles.titleBox}>
          <div className={styles.title}>
            <h1 className={styles.pageTitle}>재고 관리</h1>
            <p className={styles.memberCount}>📦 {inventoryData.length}</p> {/* Inventory count */}
          </div>
        </div>
        
        <Table className={styles.memberTable}>
          <thead>
            <tr className={styles.headBox}>
              <th>#</th>
              <th>품목명</th>
              <th>카테고리</th>
              <th>수량</th>
              <th>가격</th>
              <th>수정</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {inventoryData.map((item) => (
              <tr key={item.id}>
                <th>{item.id}</th>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>
                  <Button
                    variant="primary"
                    className={styles.updateBtn}
                    onClick={() => handleShowEditModal(item)}
                  >
                    수정
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Add Inventory Modal */}
        <Modal show={showAddModal} onHide={handleCloseAddModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>재고 추가</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleFormSubmit}>
              <Form.Group controlId="formItemName" className={styles.formContext}>
                <Form.Label className={styles.formLabel}>품목명</Form.Label>
                <Form.Control type="text" placeholder="품목명 입력" className={styles.formValue} required />
              </Form.Group>
              <Form.Group controlId="formCategory" className={styles.formContext}>
                <Form.Label className={styles.formLabel}>카테고리</Form.Label>
                <Form.Control type="text" placeholder="카테고리 입력" className={styles.formValue} required />
              </Form.Group>
              <Form.Group controlId="formQuantity" className={styles.formContext}>
                <Form.Label className={styles.formLabel}>수량</Form.Label>
                <Form.Control type="number" placeholder="수량 입력" className={styles.formValue} required />
              </Form.Group>
              <Form.Group controlId="formPrice" className={styles.formContext}>
                <Form.Label className={styles.formLabel}>가격</Form.Label>
                <Form.Control type="number" placeholder="가격 입력" className={styles.formValue} required />
              </Form.Group>
              <Button variant="primary" type="submit" className={styles.saveBtn}>
                저장
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Edit Inventory Modal */}
        <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>재고 수정</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleFormSubmit}>
              <Form.Group controlId="formItemName" className={styles.formContext}>
                <Form.Label className={styles.formLabel}>품목명</Form.Label>
                <Form.Control type="text" defaultValue={selectedItem?.name} className={styles.formValue} required />
              </Form.Group>
              <Form.Group controlId="formCategory" className={styles.formContext}>
                <Form.Label className={styles.formLabel}>카테고리</Form.Label>
                <Form.Control type="text" defaultValue={selectedItem?.category} className={styles.formValue} required />
              </Form.Group>
              <Form.Group controlId="formQuantity" className={styles.formContext}>
                <Form.Label className={styles.formLabel}>수량</Form.Label>
                <Form.Control type="number" defaultValue={selectedItem?.quantity} className={styles.formValue} required />
              </Form.Group>
              <Form.Group controlId="formPrice" className={styles.formContext}>
                <Form.Label className={styles.formLabel}>가격</Form.Label>
                <Form.Control type="number" defaultValue={selectedItem?.price} className={styles.formValue} required />
              </Form.Group>
              <Button variant="primary" type="submit" className={styles.saveBtn}>
                저장
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default CompanyUserStock;
