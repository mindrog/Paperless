import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from '../../styles/company/company_email_send.module.css';
import '../../styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';

function CompanyUserEmailSend() {
    const [dragOver, setDragOver] = useState(false);
    const [files, setFiles] = useState([]);
    const [existingAttachments, setExistingAttachments] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate(); // useNavigate 훅 사용

    const location = useLocation();
    const emailToForward = location.state?.emailToForward;
    const receiverEmailFromState = location.state?.receiverEmail || '';



    const [receiverEmail, setReceiverEmail] = useState(receiverEmailFromState);
    const [ccEmail, setCcEmail] = useState('');
    const [title, setTitle] = useState('');
    const [emailContent, setEmailContent] = useState('');

    const employee = useSelector((state) => state.user.data);
    const email = employee ? employee.emp_email : null;

    console.log(email);

    const MAX_FILES = 10;
    const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB 


    useEffect(() => {
        if (emailToForward) {
            setReceiverEmail(''); // 전달 시 받는 사람은 새로 입력
            setCcEmail('');
            setTitle(`Fwd: ${emailToForward.title}`);
            setEmailContent(`\n\n---------- Forwarded message ----------\nFrom: ${emailToForward.writerDisplayInfo} <${emailToForward.writerEmail}>\nDate: ${new Date(emailToForward.sendDate).toLocaleString()}\nSubject: ${emailToForward.title}\nTo: ${emailToForward.recipientDisplayInfo}\n\n${emailToForward.content}`);

            if (emailToForward.hasAttachment && emailToForward.attachments) {
                setExistingAttachments(emailToForward.attachments.map(att => ({
                    attaNo: att.attaNo,
                    attaOriginalName: att.attaOriginalName,
                    attaUrl: att.attaUrl,
                    attaSize: att.attaSize,
                })));
            }

        }
    }, [emailToForward]);

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
        setIsOpen(true);
    };

    // 전달 첨부파일 삭제 핸들러
    const handleDeleteExistingFile = (attaNo) => {
        const updatedAttachments = existingAttachments.filter(att => att.attaNo !== attaNo);
        setExistingAttachments(updatedAttachments);
    };

    // 새로운 첨부파일 삭제 핸들러 
    const handleDeleteNewFile = (index) => {
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

    const handlePreview = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSend = () => {
        alert('이메일이 전송되었습니다!');
        setShowModal(false);
    };

    const handleFormSend = async (e) => {
        e.preventDefault();

        if (!email) {
            alert('보낸 사람 이메일이 설정되지 않았습니다.');
            return;
        }

        const formData = new FormData();
        formData.append('senderEmail', email);
        formData.append('recipientEmail', receiverEmail);
        formData.append('ccEmail', ccEmail);
        formData.append('title', title);
        formData.append('content', emailContent);

        files.forEach((file) => {
            formData.append('attachments', file);
        });

        if (existingAttachments && existingAttachments.length > 0) {
            existingAttachments.forEach((att) => {
                formData.append('existingAttachmentNos', att.attaNo);
            });
        }
        // JWT 토큰 가져오기 
        const token = localStorage.getItem('jwt');

        
        console.log('FormData existingAttachmentNos:', existingAttachments.map(att => att.attaNo));
        try {
            const response = await fetch('http://localhost:8080/api/emails/send', {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,

                },
                body: formData,
            });

            if (response.ok) {
                alert('이메일이 성공적으로 전송되었습니다.');
                navigate('/Company/user/email');
            } else {
                const errorData = await response.json();
                alert(`이메일 전송에 실패했습니다: ${errorData.message || '알 수 없는 오류'}`);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('이메일 전송 중 오류가 발생했습니다.');
        }
    };



    const calculateTotalFileSize = () => {
        const totalSize = files.reduce((acc, file) => acc + file.size, 0) + + existingAttachments.reduce((acc, att) => acc + att.attaSize, 0);
        return formatBytes(totalSize);
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) {


            return `0 KB`;
        } else if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        } else {
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        }
    };

    return (
        <div className="container-xl conbox1">
            <div className="emilFormContainer">
                <div className={styles.Container}>
                    <form onSubmit={handleFormSend}>
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
                                    required
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
                                    required
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
                                        {existingAttachments.length === 0 && files.length === 0 ? (
                                            <p>파일을 이 곳으로 끌어오세요</p>
                                        ) : (
                                            <ul className={styles['file-list']}>
                                                {/* 기존 첨부파일 표시 */}
                                                {existingAttachments.map((att) => (
                                                    <li key={`existing-${att.attaNo}`} className={styles['file-item']}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteExistingFile(att.attaNo)}
                                                            className={styles['delete-button']}
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </button>
                                                        <a href={att.attaUrl} target="_blank" rel="noopener noreferrer">
                                                            {att.attaOriginalName}
                                                        </a>
                                                        {/* 첨부파일 크기 표시 (선택 사항) */}
                                                        {/* <span> ({formatBytes(att.attaSize)})</span> */}
                                                    </li>
                                                ))}

                                                {/* 새로운 첨부파일 표시 */}
                                                {files.map((file, index) => (
                                                    <li key={`new-${index}`} className={styles['file-item']}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteNewFile(index)}
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
                                    required
                                ></textarea>
                                <span className={styles.underline}></span>
                            </div>
                        </div>

                        {/* 버튼 영역 */}
                        <div className={styles['form-actions']}>
                            <button type="submit" className={styles['btn-send']}>
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
                        <p><strong>보낸 사람:</strong> {email}</p>
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

export default CompanyUserEmailSend;
