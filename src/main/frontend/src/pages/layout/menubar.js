import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/layout/menubar.module.css'; // CSS 모듈 사용 시
import { Button, Modal } from 'react-bootstrap';

const Menubar = ({ isMenuOpen }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false); // 기안 문서함 상태
    const [isFormDropdownOpen, setIsFormDropdownOpen] = useState(false); // 기안 양식 상태
    const [notificationModal, setNotificationModal] = useState(false); // 알림 모달
    const [activeItem, setActiveItem] = useState(null); // 클릭된 메뉴 항목을 추적하는 상태
    const [isDraftSectionActive, setIsDraftSectionActive] = useState(false); // 기안 관리 섹션 활성화 상태

    const navigate = useNavigate();
    const location = useLocation();

    // 일반적인 메뉴 항목 클릭
    const handleItemClick = (itemName) => {
        setActiveItem(itemName); // 클릭된 항목을 active 상태로 설정
        setIsDraftSectionActive(false); // 다른 메뉴 클릭 시 기안 관리 섹션 비활성화
        setIsDropdownOpen(false); // 드롭다운 닫기
        setIsDocDropdownOpen(false); // 기안 문서함 드롭다운 닫기
        setIsFormDropdownOpen(false); // 기안 양식 드롭다운 닫기
        navigate(itemName); // 해당 경로로 이동
    };

    // 기안 관리 하위 메뉴 클릭
    const handleDraftSectionClick = (itemName) => {
        setActiveItem(itemName); // 하위 메뉴를 클릭한 경우 해당 경로로 이동
        setIsDraftSectionActive(true); // 기안 관리 섹션을 활성화
        navigate(itemName); // 해당 경로로 이동
    };

    // 경로에 따라 프로필 이름 변경
    const profileName = location.pathname.toLowerCase().startsWith('/company/admin')
        ? '강동원'
        : location.pathname.toLowerCase().startsWith('/company/user')
            ? '배수지'
            : '사용자';

    // 경로에 따른 직급 설정
    const getUserGrade = () => {
        if (location.pathname.toLowerCase().startsWith('/company/admin')) {
            return '부장'; // 회사 관리자
        } else if (location.pathname.toLowerCase().startsWith('/company/user')) {
            return '대리'; // 회사 사용자
        }
        return '사용자'; // 기본 값
    };

    const showEmployeeNotificationModal = () => {
        setNotificationModal(true);
    };

    const closeEmployeeNotificationModal = () => {
        setNotificationModal(false);
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

    return (
        <nav className={`${styles.menubar} ${isMenuOpen ? styles.showMenu : ''}`}>
            <div className={styles.menubar}>
                <div className={styles.profil}>
                    <div className={styles.profilbox}>
                        <div className={styles.profiltitle}>
                            <p>기획전략팀</p>
                            <div className={styles.titlename}>
                                <div className={styles.userName}>{profileName}</div>
                                <div className={styles.userGrade}>{getUserGrade()}</div>
                            </div>
                        </div>
                        <div className={styles.iconbox}>
                            <button onClick={showEmployeeNotificationModal}><i className="material-icons notifications">notifications</i></button>
                            <button onClick={() => handleItemClick('/company/user/email')}><i className="material-icons mail">mail</i></button>
                            <button onClick={() => handleItemClick('/company/user/chat')}><i className="material-icons chat_bubble">chat_bubble</i></button>
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
                        <Button variant="primary" onClick={closeEmployeeNotificationModal}>
                            닫기
                        </Button>
                    </Modal.Footer>
                </Modal>

                <ul className={styles.menuList}>
                    <li className={`${styles.dropdown} ${activeItem === '/company/user/mypage' ? styles.active : ''}`} onClick={() => handleItemClick('/company/user/mypage')} >
                        <button className={styles.sublist_mypage}>
                            🧑 마이페이지
                        </button>
                    </li>

                    {/* 기안 관리 섹션 */}
                    <li className={`${styles.dropdown} ${isDropdownOpen ? styles.active : ''}`}>
                        <button onClick={toggleDropdown} className={`${styles.dropdownToggle} ${isDraftSectionActive ? styles.active : ''}`}>
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
                                                <li>
                                                    <button 
                                                        className={`${styles.lastsubmenu} ${activeItem === '/company/user/draft/doc/all' ? styles.active : ''}`} 
                                                        onClick={() => handleDraftSectionClick('/company/user/draft/doc/all')}
                                                    >
                                                        📁 전체 문서함
                                                    </button>
                                                </li>
                                                <li>
                                                    <button 
                                                        className={`${styles.lastsubmenu} ${activeItem === '/company/user/draft/doc/draft' ? styles.active : ''}`} 
                                                        onClick={() => handleDraftSectionClick('/company/user/draft/doc/draft')}
                                                    >
                                                        📁 임시 저장함
                                                    </button>
                                                </li>
                                                <li>
                                                    <button 
                                                        className={`${styles.lastsubmenu} ${activeItem === '/company/user/draft/doc/approval' ? styles.active : ''}`} 
                                                        onClick={() => handleDraftSectionClick('/company/user/draft/doc/approval')}
                                                    >
                                                        📁 결재 문서함
                                                    </button>
                                                </li>
                                            </ul>
                                        )}
                                    </li>
                                    <li>
                                        <button onClick={toggleDocDropdown}  className={styles.submenu2}>
                                            📑 기안 양식
                                        </button>
                                        {isDocDropdownOpen && (
                                            <ul className={styles.innerSubDropdownMenu_draftWrite}>
                                                <li>
                                                    <button 
                                                        className={`${styles.lastsubmenu} ${activeItem === '/company/user/draft/write/work' ? styles.active : ''}`} 
                                                        onClick={() => handleDraftSectionClick('/company/user/draft/write/work')}>
                                                        📄 업무 보고 기안
                                                    </button>
                                                </li>
                                                <li>
                                                    <button 
                                                        className={`${styles.lastsubmenu} ${activeItem === '/company/user/draft/write/attendance' ? styles.active : ''}`} 
                                                        onClick={() => handleDraftSectionClick('/company/user/draft/write/attendance')}>
                                                        📄 근태 신청 기안
                                                    </button>
                                                </li>
                                                <li>
                                                    <button 
                                                        className={`${styles.lastsubmenu} ${activeItem === '/company/user/draft/write/purchase' ? styles.active : ''}`} 
                                                        onClick={() => handleDraftSectionClick('/company/user/draft/write/purchase')}>
                                                        📄 구매 신청 기안
                                                    </button>
                                                </li>
                                            </ul>
                                        )}
                                    </li>
                                </ul>
                            </div>
                        )}
                    </li>

                    <li className={`${styles.dropdown} ${activeItem === '/company/user/calendar' ? styles.active : ''}`}
                        onClick={() => handleItemClick('/company/user/calendar')} >
                        <button className={styles.sublist_cal}>
                            📅 일정 관리
                        </button>
                    </li>

                    {/* '/company/admin' 또는 '/company/admin'으로 시작하는 경로에서만 직원 관리 보이기 */}
                    {location.pathname.toLowerCase().startsWith('/company/admin') && (
                        <li className={`${styles.dropdown} ${activeItem === '/company/admin/member' ? styles.active : ''}`}
                            onClick={() => handleItemClick('/company/admin/member')} >
                            <button className={styles.sublist_member}>
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
