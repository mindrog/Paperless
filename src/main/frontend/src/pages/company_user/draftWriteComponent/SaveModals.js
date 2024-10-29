import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

const SaveModals = ({
  showCancelModal, handleCloseCancelModal, handleSaveAsDraftAndRedirect,
  showSaveModal, handleRedirectAfterSave, showAlert, saveDate, setShowAlert,
}) => (
  <>
    {showAlert && (
      <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
        임시 저장되었습니다. 현재 날짜: {saveDate}
      </Alert>
    )}
    <Modal show={showCancelModal} onHide={handleCloseCancelModal} centered>
      <Modal.Body>작성된 내용을 임시 저장하시겠습니까?</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSaveAsDraftAndRedirect}>예</Button>
        <Button variant="secondary" onClick={handleCloseCancelModal}>아니오</Button>
      </Modal.Footer>
    </Modal>
    <Modal show={showSaveModal} onHide={handleRedirectAfterSave} centered>
      <Modal.Header closeButton>
        <Modal.Title>임시 저장</Modal.Title>
      </Modal.Header>
      <Modal.Body>임시 저장되었습니다.</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleRedirectAfterSave}>확인</Button>
      </Modal.Footer>
    </Modal>
  </>
);

export default SaveModals;
