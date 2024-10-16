import React, { useState, useRef } from 'react';
import styles from '../../styles/company/company_email_send.module.css';
import '../../styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';

function CompanyAdminEmailSend () {
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

    // 파일 업로드 제한 설정
    const MAX_FILES = 10;
    const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB in bytes

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
        addFiles(newFiles);
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);

        if (newFiles.length > 0) {
            addFiles(newFiles);
        }
    };

    const addFiles = (newFiles) => {
        let updatedFiles = [...files];
        let totalSize = updatedFiles.reduce((acc, file) => acc + file.size, 0);

        for (let file of newFiles) {
            if (updatedFiles.length >= MAX_FILES) {
                alert(`파일은 최대 ${MAX_FILES}개까지 업로드할 수 있습니다.`);
                break;
            }
            if (totalSize + file.size > MAX_TOTAL_SIZE) {
                alert('파일 총 용량은 25MB를 초과할 수 없습니다.');
                break;
            }
            updatedFiles.push(file);
            totalSize += file.size;
        }

        setFiles(updatedFiles);
        // 파일이 추가되면 자동으로 파일 리스트를 열기
        setIsOpen(true);
    };

    const handleDeleteFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
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

    // 보내기 함수
    const handleSend = () => {
        alert('이메일이 전송되었습니다!');
        setShowModal(false);
    };

    // 이메일 작성 폼에서 보내기 버튼 클릭 시
    const handleFormSend = () => {
        alert('이메일이 전송되었습니다!');
    };

    // 첨부파일 총 크기 계산 함수
    const calculateTotalFileSize = () => {
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        return formatBytes(totalSize);
    };

    // 바이트를 읽기 쉬운 형식으로 변환하는 함수
    const formatBytes = (bytes) => {
        // if (bytes < 1024) {
        //     return `${bytes} bytes`;
        // } else 
        if(bytes==0){
            return `0 KB`;
        }else if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        } else {
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        }
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
                                    {/* 총 용량 표시 */}
                                    <span className={styles['file-size']}>
                                        {`(${calculateTotalFileSize()} / 25MB)`}
                                    </span>
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
                                                        {file.name} ({formatBytes(file.size)})
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
                            <button type="button" className={styles['btn-send']} onClick={handleFormSend}>
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
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: '#2e3d86', fontWeight: 'bold' }}>이메일 미리보기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles['email-preview']}>
                        
                        <h3 className={styles['email-title']}>{title}</h3>
                       
                        <p><strong>보낸 사람:</strong> me@paperless.com</p>
                        <p><strong>받는 사람:</strong> {receiverEmail}</p>
                        <p><strong>참조:</strong> {ccEmail}</p>
                        
                        <div className={styles['attachment-section']}>
                        
                            <hr className={styles['attachment-divider']} />
                            <p>첨부파일: 
                            {files.length === 0 ? (
                                ' 첨부한 파일이 없습니다.'
                            ) : files.length === 1 ? (
                                ` ${files[0].name} (${formatBytes(files[0].size)})`
                            ) : (
                               
                                ` 첨부파일 ${files.length}개 (${calculateTotalFileSize()})`
                                
                            )}
                            </p>
                            <hr className={styles['attachment-divider']} />
                        </div>
                        {/* 내용 */}
                        <div className={styles['email-content']}>
                            <div style={{ whiteSpace: 'pre-wrap' }}>{emailContent}</div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {/* 보내기 버튼 */}
                    <Button
                        variant="primary"
                        onClick={handleSend}
                        style={{ backgroundColor: '#2e3d86', borderColor: '#2e3d86' }}
                    >
                        보내기
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CompanyAdminEmailSend;
