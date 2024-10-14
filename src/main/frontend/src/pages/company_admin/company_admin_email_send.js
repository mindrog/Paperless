import React, { useState, useRef } from 'react';
import styles from '../../styles/company/company_email_send.module.css';
import '../../styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘 임포트

function Company_admin_email_send() {
    const [dragOver, setDragOver] = useState(false);
    const [files, setFiles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef(null);


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

        // 파일이 선택된 경우에만 상태를 업데이트 (파일선택 버튼 누르고 아무것도 선택 안하고 종료시 전에 선택한 파일까지 삭제되는 현상 방지)
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
                                />
                                <span className={styles.underline}></span>
                            </div>
                        </div>

                        {/* 파일첨부 영역 */}
                        <div className={styles['form-group']}>
                            <div className={styles['file-header']}>
                                <label htmlFor="file" className={styles['form-label']}>첨부파일<button type="button" onClick={toggleFileArea} className={styles['icon']}>
                                    <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
                                </button></label>
                                
                            </div>
                            <label htmlFor="file">
                                <div className={styles['btn-upload']}>파일 업로드하기</div>
                            </label>
                            <input
                                type="file"
                                id="file"
                                className={styles['file-input']}
                                onChange={handleFileChange}
                                multiple
                                style={{ display: 'none' }}
                            />
                            {isOpen && (
                                <div
                                    className={`${styles.dropzone} ${dragOver ? styles.active : ''}`}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    style={{
                                        height: files.length === 0 ? '60px' : 'auto',
                                        border: dragOver ? '2px solid blue' : '2px dashed gray',
                                        padding: '10px',
                                        textAlign: 'center',
                                        marginTop: '10px'
                                    }}
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
                        </div>
                        <div className={styles['form-group']}>
                            <label htmlFor="emailContent" className={styles['form-label']}>내용</label>
                            <div className={styles['input-container']}>
                                <textarea
                                    id="emailContent"
                                    className={styles.textarea}
                                    placeholder="이메일 내용을 입력하세요"
                                ></textarea>
                                <span className={styles.underline}></span>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default Company_admin_email_send;
