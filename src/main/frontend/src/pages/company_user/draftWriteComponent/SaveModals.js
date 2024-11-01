import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import styles from '../../../styles/draftWriteComponent/saveModals.module.css';

const SaveModals = ({
  showCancelModal,
  handleCloseCancelModal,
  handleSaveAsDraftAndRedirect,
  showSaveModal,
  handleRedirectAfterSave,
  showAlert,
  alertMessage,
  saveDate,
  setShowAlert,
}) => (
  <>
    {showAlert && (
      <Alert
      variant={alertMessage.includes("실패") ? "danger" : "success"}
      onClose={() => setShowAlert(false)}
      dismissible
    >
      {alertMessage}
      </Alert>  
    )}

    <Modal
      show={showCancelModal}
      onHide={handleCloseCancelModal}
      centered
      className={styles.cancelModal} // Cancel Modal에 className 추가
    >
      <Modal.Body className={styles.modalBody}>작성된 내용을 임시 저장하시겠습니까?</Modal.Body>
      <Modal.Footer className={styles.modalFooter}>
        <Button
          variant="primary"
          onClick={handleSaveAsDraftAndRedirect}
          className={styles.primaryButton} // 예 버튼에 className 추가
        >
          예
        </Button>
        <Button
          variant="secondary"
          onClick={handleCloseCancelModal}
          className={styles.secondaryButton} // 아니오 버튼에 className 추가
        >
          아니오
        </Button>
      </Modal.Footer>
    </Modal>

    <Modal
      show={showSaveModal}
      onHide={handleRedirectAfterSave}
      centered
      className={styles.saveModal} // Save Modal에 className 추가
    >
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>임시 저장</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>임시 저장되었습니다.</Modal.Body>
      <Modal.Footer className={styles.modalFooter}>
        <Button
          variant="primary"
          onClick={handleRedirectAfterSave}
          className={styles.primaryButton} // 확인 버튼에 className 추가
        >
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  </>
);

export default SaveModals;
