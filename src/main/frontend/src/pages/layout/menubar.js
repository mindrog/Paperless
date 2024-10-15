import React, { useState } from 'react';
import { useNavigate, useLocation, Form } from 'react-router-dom';
import styles from '../../styles/layout/menubar.module.css'; // CSS 모듈 사용 시
import { Button, Modal } from 'react-bootstrap';

const Menubar = ({ isMenuOpen }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false); // 기안 문서함 상태
    const [isFormDropdownOpen, setIsFormDropdownOpen] = useState(false); // 기안 양식 상태
    const [notificationModal, setNotificationModal] = useState(false); // 알림 모달

    const location = useLocation();
    const navigate = useNavigate();

    // 경로에 따라 프로필 이름 변경
    const profileName = location.pathname.toLowerCase().startsWith('/company/admin')
        ? '강동원'
        : location.pathname.toLowerCase().startsWith('/company/user')
            ? '배수지'
            : '사용자';

    const showEmployeeNotificationModal = () => {
        setNotificationModal(true);
    };

    const closeEmployeeNotificationModal = () => {
        setNotificationModal(false);
    };

    const handleEmployeeEmail = () => {
        navigate('/Company/user/email');
    };

    const handleEmployeeChat = () => {
        navigate('/Company/user/chat');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleDocDropdown = () => {
        setIsDocDropdownOpen(!isDocDropdownOpen);
    };

    const toggleFormDropdown = () => {
        setIsFormDropdownOpen(!isFormDropdownOpen);
    };

    const handleEmployeeMypage = () => {
        navigate('/Company/user/mypage');
    };

    const handleEmployeeManagementClick = () => {
        navigate('/Company/admin/member');
    };

    const handleEmployeeCalendar = () => {
        navigate('/Company/user/calendar'); // 임시 calendar 페이지 url
    }

    const handleEmployeeDraftList = () => {
        navigate('/Company/user/draft/list');
    }

    const handleEmployeeDraftWrite = () => {
        navigate('/Company/user/draft/write');
    }

    return (
        <nav className={`${styles.menubar} ${isMenuOpen ? styles.showMenu : ''} ${isDropdownOpen ? styles.open : ''}`}>
            <div className={styles.menubar}>
                <div className={styles.profil}>
                    <div className={styles.profilbox}>
                        <div className={styles.profiltitle}>
                            <p>기획전략팀</p>
                            <div className={styles.titlename}>
                                <div className={styles.userName}>{profileName}</div>
                                <div className={styles.userGrade}>대리</div>
                            </div>
                        </div>
                        <div className={styles.iconbox}>
                            <button onClick={showEmployeeNotificationModal}><i className="material-icons notifications">notifications</i></button>
                            <button onClick={handleEmployeeEmail}><i className="material-icons mail">mail</i></button>
                            <button onClick={handleEmployeeChat}><i className="material-icons chat_bubble">chat_bubble</i></button>
                        </div>
                    </div>
                </div>

                <Modal show={notificationModal} onHide={closeEmployeeNotificationModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>알림 목록</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>알림 리스트</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={closeEmployeeNotificationModal} >
                            닫기
                        </Button>
                    </Modal.Footer>
                </Modal>

                <ul className={styles.menuList}>
                    <li className={styles.dropdown}>
                        <button onClick={handleEmployeeMypage} className={styles.sublist}>
                            🧑 마이페이지
                        </button>
                    </li>
                    <li className={styles.dropdown}>
                        <button onClick={toggleDropdown} className={styles.dropdownToggle}>
                            📑 기안 관리
                        </button>
                        {/* 기안 관리 하위 메뉴 */}
                        {isDropdownOpen && (
                            <div className={styles.subDropdownMenu}>
                                <ul>
                                    <li>
                                        <button onClick={toggleDocDropdown} className={styles.submenu}>
                                            🗂️ 기안 문서함
                                        </button>
                                        {isDocDropdownOpen && (
                                            <ul className={styles.innerSubDropdownMenu_draftList}>
                                                <li><button className={styles.lastsubmenu} onClick={handleEmployeeDraftList}><p>📁 전체 문서함</p></button></li>
                                                <li><button className={styles.lastsubmenu} onClick={handleEmployeeDraftList}><p>📁 임시 저장함</p></button></li>
                                                <li><button className={styles.lastsubmenu} onClick={handleEmployeeDraftList}><p>📁 결재 문서함</p></button></li>
                                            </ul>
                                        )}
                                    </li>
                                    <li>
                                        <button onClick={toggleFormDropdown} className={styles.submenu2}>
                                            📑 기안 양식
                                        </button>
                                        {isFormDropdownOpen && (
                                            <ul className={styles.innerSubDropdownMenu_draftWrite}>
                                                <li><button className={styles.lastsubmenu} onClick={handleEmployeeDraftWrite}><p>📄 업무 보고 기안</p></button></li>
                                                <li><button className={styles.lastsubmenu} onClick={handleEmployeeDraftWrite}><p>📄 근태 신청 기안</p></button></li>
                                                <li><button className={styles.lastsubmenu} onClick={handleEmployeeDraftWrite}><p>📄 구매 신청 기안</p></button></li>
                                            </ul>
                                        )}
                                    </li>
                                </ul>
                            </div>
                        )}
                    </li>

                    <li className={styles.dropdown}>
                        <button onClick={handleEmployeeCalendar} className={styles.sublist}>
                            📅 일정 관리
                        </button>
                    </li>

                    {/* '/Company/admin' 또는 '/company/admin'으로 시작하는 경로에서만 직원 관리 보이기 */}
                    {location.pathname.toLowerCase().startsWith('/company/admin') && (
                        <li className={styles.dropdown}>
                            <button onClick={handleEmployeeManagementClick} className={styles.sublist}>
                                ⚙️ 직원 관리
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Menubar;
