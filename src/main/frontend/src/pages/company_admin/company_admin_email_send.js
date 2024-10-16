import React, { useState, useRef } from 'react';
import styles from '../../styles/company/company_email_send.module.css';
import '../../styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';

function Company_admin_email_send() {
    const [dragOver, setDragOver] = useState(false);
    const [files, setFiles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const fileInputRef = useRef(null);

    // 이메일 입력 상태 추가
    const [receiverEmail, setReceiverEmail] = useState('');
    const [ccEmail, setCcEmail] = useState('');
    const [title, setTitle] = useState('');
    const [emailContent, setEmailContent] = useState('');

    // 드래그 앤 드롭 이벤트 핸들러
    const handleDragEnter = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);

        const newFiles = Array.from(e.dataTransfer.files);
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);

        if (newFiles.length > 0) {
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    const handleDeleteFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const toggleFileArea = () => {
        setIsOpen(!isOpen);
    };

    const handleFileUploadClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };

    // 미리보기 모달 핸들러
    const handlePreview = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="container-xl conbox1">
            <div className="gridContainer">
                <div className={styles.Container}>
                    <form>
                        <div className={styles['form-group']}>
                            <label htmlFor="receiverEmail" className={styles['form-label']}>받는 사람</label>
                            <div className={styles['input-container']}>
                                <input
                                    type="text"
                                    id="receiverEmail"
                                    className={styles.input}
                                    placeholder="이메일 주소를 입력하세요"
                                    value={receiverEmail}
                                    onChange={(e) => setReceiverEmail(e.target.value)}
                                />
                                <span className={styles.underline}></span>
                            </div>
                        </div>
                        <div className={styles['form-group']}>
                            <label htmlFor="ccEmail" className={styles['form-label']}>참조</label>
                            <div className={styles['input-container']}>
                                <input
                                    type="text"
                                    id="ccEmail"
                                    className={styles.input}
                                    placeholder="참조 이메일 주소를 입력하세요"
                                    value={ccEmail}
                                    onChange={(e) => setCcEmail(e.target.value)}
                                />
                                <span className={styles.underline}></span>
                            </div>
                        </div>
                        <div className={styles['form-group']}>
                            <label htmlFor="title" className={styles['form-label']}>제목</label>
                            <div className={styles['input-container']}>
                                <input
                                    type="text"
                                    id="title"
                                    className={styles.input}
                                    placeholder="제목을 입력하세요"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <span className={styles.underline}></span>
                            </div>
                        </div>

                        {/* 파일첨부 영역 */}
                        <div className={styles['form-group']}>
                            <label htmlFor="file" className={styles['form-label']}>첨부파일</label>
                            <div className={styles['input-container']}>
                                <div className={styles['file-header']}>
                                    <button type="button" onClick={toggleFileArea} className={styles['toggle-button']}>
                                        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
                                    </button>
                                    <div
                                        className={`${styles['btn-upload']} ${styles['file-util']}`}
                                        onClick={handleFileUploadClick}
                                    >
                                        파일 업로드하기
                                    </div>
                                </div>

                                {isOpen && (
                                    <div
                                        className={`${styles.dropzone} ${styles['file-util']} ${dragOver ? styles.active : ''}`}
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                    >
                                        {files.length === 0 ? (
                                            <p>파일을 이 곳으로 끌어오세요</p>
                                        ) : (
                                            <ul className={styles['file-list']}>
                                                {files.map((file, index) => (
                                                    <li key={index} className={styles['file-item']}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteFile(index)}
                                                            className={styles['delete-button']}
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </button>
                                                        {file.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className={styles['file-input']}
                                    onChange={handleFileChange}
                                    multiple
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        <div className={styles['form-group']}>
                            <label htmlFor="emailContent" className={styles['form-label']}>내용</label>
                            <div className={styles['input-container']}>
                                <textarea
                                    id="emailContent"
                                    className={styles.textarea}
                                    placeholder="이메일 내용을 입력하세요"
                                    value={emailContent}
                                    onChange={(e) => setEmailContent(e.target.value)}
                                ></textarea>
                                <span className={styles.underline}></span>
                            </div>
                        </div>

                        {/* 버튼 영역 */}
                        <div className={styles['form-actions']}>
                            <button type="button" className={styles['btn-send']}>
                                보내기
                            </button>
                            <button type="button" className={styles['btn-preview']} onClick={handlePreview}>
                                미리보기
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* 미리보기 모달 */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>이메일 미리보기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>보낸 사람:</strong> me@paperless.co.kr</p>
                    <p><strong>받는 사람:</strong> {receiverEmail}</p>
                    <p><strong>참조:</strong> {ccEmail}</p>
                    <p><strong>제목:</strong> {title}</p>
                    <p><strong>내용:</strong></p>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{emailContent}</div>
                    {files.length > 0 && (
                        <>
                            <p><strong>첨부파일:</strong></p>
                            <ul>
                                {files.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Company_admin_email_send;
