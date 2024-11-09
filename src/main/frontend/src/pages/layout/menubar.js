import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/layout/menubar.module.css'; // CSS 모듈 사용 시
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { setUnreadCount } from '../../store/emailSlice';

const Menubar = ({ isMenuOpen }) => {
    // Redux에서 로그인 사용자 정보 가져오기
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.data);
    const userPosi = useSelector((state) => state.user.userPosi);
    const emailUnreadCountState = useSelector((state) => state.email.emailUnreadCountState); // Redux 상태 바로 가져오기
    const totalUnreadCount = useSelector((state) => state.chat.totalUnreadCount); // Redux에서 totalUnreadCount 불러오기
    const emp_no = userData.emp_no;

    const [notificationCount, setNotificationCount] = useState(0); // 알림 개수 상태
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false); // 기안 문서함 상태
    const [isFormDropdownOpen, setIsFormDropdownOpen] = useState(false); // 기안 양식 상태
    const [notificationModal, setNotificationModal] = useState(false); // 알림 모달
    const [activeItem, setActiveItem] = useState(null); // 클릭된 메뉴 항목을 추적하는 상태
    const [isDraftSectionActive, setIsDraftSectionActive] = useState(false); // 기안 관리 섹션 활성화 상태
    const [openChatRoom, setOpenChatRoom] = useState(); // 창이 열려있는지 추적하는 상태

    const navigate = useNavigate();
    const location = useLocation();

    // totalUnreadCount가 변경될 때 리랜더링 트리거
    useEffect(() => {
        console.log('Unread count updated:', totalUnreadCount);
    }, [totalUnreadCount]);

    // 일반적인 메뉴 항목 클릭
    const handleItemClick = (itemName) => {
        setActiveItem(itemName); // 클릭된 항목을 active 상태로 설정
        setIsDraftSectionActive(false); // 다른 메뉴 클릭 시 기안 관리 섹션 비활성화
        setIsDropdownOpen(false); // 드롭다운 닫기
        setIsDocDropdownOpen(false); // 기안 문서함 드롭다운 닫기
        setIsFormDropdownOpen(false); // 기안 양식 드롭다운 닫기
        navigate(itemName); // 해당 경로로 이동
    };

    const MenubarSuper = () => {
        return (
            <div className={styles.menubar}>
                <div className={styles.profil}>
                    <div className={styles.profilbox}>
                        <div className={styles.profiltitle} onClick={handlerCompanyMain}>
                            <p></p>
                            <div className={styles.titlename}>
                                <div className={styles.userName}>{userData.emp_name}</div>
                            </div>
                        </div>
    
                    </div>
                </div>
                <ul className={styles.menuList}>
                    <li className={`${styles.dropdown} ${activeItem === '/system/admin/member' ? styles.active : ''}`} onClick={() => handleItemClick('/system/admin/member')} >
                        <button className={styles.sublist_mypage}>
                            🧑 도입 업체
                        </button>
                    </li>

                    <li className={`${styles.dropdown} ${activeItem === '/system/admin/inquiry' ? styles.active : ''}`}
                        onClick={() => handleItemClick('/system/admin/inquiry')} >
                        <button className={styles.sublist_member}>
                            ⚙️ 문의 관리
                        </button>
                    </li>
                </ul>
            </div>);
    };

    const MenubarAdmin = () => {
        return (
            <div className={styles.menubar}>
                <div className={styles.profil}>
                    <div className={styles.profilbox}>
                        <div className={styles.profiltitle} onClick={handlerCompanyMain}>
                            <p></p>
                            <div className={styles.titlename}>
                                <div className={styles.userName}>{userData.emp_name}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <ul className={styles.menuList}>
                    <li className={`${styles.dropdown} ${activeItem === '/company/info' ? styles.active : ''}`} onClick={() => handleItemClick('/company/info')} >
                        <button className={styles.sublist_mypage}>
                            🧑 회사 관리
                        </button>
                    </li>

                    <li className={`${styles.dropdown} ${activeItem === '/company/admin/member' ? styles.active : ''}`}
                        onClick={() => handleItemClick('/company/admin/member')} >
                        <button className={styles.sublist_member}>
                            ⚙️ 직원 관리
                        </button>
                    </li>
                </ul>
            </div>);
    };

    const MenubarUser = () => {
        return (
            <div className={styles.menubar}>
                <div className={styles.profil}>
                    <div className={styles.profilbox}>
                        <div className={styles.profiltitle} onClick={handlerCompanyMain}>
                            <p></p>
                            <div>
                                {userData.dept_name} {userData.dept_team_name}
                            </div>
                            <div className={styles.titlename}>
                                <div className={styles.userName}>{userData.emp_name}</div>
                                <div className={styles.userGrade}>{userPosi}</div>
                            </div>
                        </div>
                        <div className={styles.iconbox}>
                            <button onClick={showEmployeeNotificationModal}>
                                <i className="material-icons notifications">notifications</i>
                                <span className={styles.notificationCount} style={{ display: notificationCount === 0 ? 'none' : 'block' }}>{notificationCount}</span>
                            </button>
                            <button onClick={() => handleItemClick('/company/user/email')}>
                                <i className="material-icons mail">mail</i>
                                <span className={styles.notificationCount} style={{ display: emailUnreadCountState === 0 ? 'none' : 'block' }}>{emailUnreadCountState}</span>
                            </button>
                            <button onClick={() => handleChatItemClick('/chatroom')}>
                                <i className="material-icons chat_bubble">chat_bubble</i>
                                <span className={styles.notificationCount} style={{ display: totalUnreadCount === 0 ? 'none' : 'block' }}>{totalUnreadCount}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <ul className={styles.menuList}>
                    <li className={`${styles.dropdown} ${activeItem === '/company/user/mypage' ? styles.active : ''}`} onClick={() => handleItemClick('/company/user/mypage')} >
                        <button className={styles.sublist_mypage}>
                            🧑 마이페이지
                        </button>
                    </li>

                    {/* 기안 관리 섹션 */}
                    <li className={`${styles.dropdown} ${isDropdownOpen ? styles.active : ''}`}>
                        <button onClick={toggleDropdown} className={`${styles.dropdownToggle} ${isDraftSectionActive ? styles.active : ''}`}>
                            📑 문서 관리
                        </button>
                        {/* 기안 관리 하위 메뉴 */}
                        {isDropdownOpen && (
                            <div className={styles.subDropdownMenu}>
                                <ul>
                                    <li>
                                        <button onClick={toggleDocDropdown} className={styles.submenu}>
                                        📂 전자 문서함
                                        </button>
                                        {isDocDropdownOpen && (
                                            <ul className={styles.innerSubDropdownMenu_draftList}>
                                                <li>
                                                    <button
                                                        className={`${styles.lastsubmenu} ${activeItem === '/company/user/draft/doc/all' ? styles.active : ''}`}
                                                        onClick={() => handleDraftSectionClick('/company/user/draft/doc/all')}
                                                    >
                                                        📄 전체 문서함
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className={`${styles.lastsubmenu} ${activeItem === '/company/user/draft/doc/draft' ? styles.active : ''}`}
                                                        onClick={() => handleDraftSectionClick('/company/user/draft/doc/draft')}
                                                    >
                                                        📄 임시 저장함
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className={`${styles.lastsubmenu} ${activeItem === '/company/user/draft/doc/penforappr' ? styles.active : ''}`}
                                                        onClick={() => handleDraftSectionClick('/company/user/draft/doc/penforappr')}>
                                                        📄 결재 대기함
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className={`${styles.lastsubmenu} ${activeItem === '/company/user/draft/doc/myuser' ? styles.active : ''}`}
                                                        onClick={() => handleDraftSectionClick('/company/user/draft/doc/myuser')}>
                                                        📄 내 문서함
                                                    </button>
                                                </li>
                                            </ul>
                                        )}
                                    </li>
                                    <li>
                                        <button onClick={toggleDocDropdown} className={styles.submenu2}>
                                            📂 기안 양식
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


                    <li className={`${styles.dropdown} ${activeItem === '/company/user/stock' ? styles.active : ''}`}
                        onClick={() => handleItemClick('/company/user/stock')} >
                        <button className={styles.sublist_cal}>
                            📦 재고 관리
                        </button>
                    </li>
                </ul>
            </div>);
    };

    const renderMenu = (userData) => {
        if (userData.emp_role === 'super') {
            return <MenubarSuper />;
        } else if (userData.emp_role === 'admin') {
            return <MenubarAdmin />;
        } else {
            return <MenubarUser />;
        }
    };

    // 채팅 아이콘 클릭
    const handleChatItemClick = async (url) => {
        try {
            console.log("url:", url);
            console.log("emp_no:", emp_no);

            if (emp_no) {
                if (openChatRoom && !openChatRoom.closed) {
                    // 열려있는 창이 있으면 focus
                    openChatRoom.window.focus();
                } else {
                    // 새 창 띄우기
                    const newChat = window.open(
                        `${url}?emp_no=${emp_no}`, "chatWindow",
                        `width=920, height=780, top=50, left=180, scrollbars=yes, resizable=no`
                    );

                    if (newChat) {
                        // 새 창 데이터 추가
                        setOpenChatRoom(newChat);
                    } else {
                        console.error("Failed to open the chat window. Please allow pop-ups.");
                    }
                }
            } else {
                console.warn(`No chatRoom page fount with emp_no: ${emp_no}`);
            }
        } catch (error) {
            console.error("Error opening chat: ", error);
        }
    };

    // 기안 관리 하위 메뉴 클릭
    const handleDraftSectionClick = (itemName) => {
        const isAdminPath = location.pathname.toLowerCase().startsWith('/company/admin');

        if (isAdminPath && itemName === '/company/user/draft/doc/approval') {
            setActiveItem('/company/admin/approval'); // 관리자는 '/company/admin/approval' 경로로 설정
            navigate('/company/admin/approval');
        } else {
            setActiveItem(itemName); // 일반 사용자는 기존 경로로 설정
            navigate(itemName);
        }
    };

    const handlerCompanyMain = () => {
        console.log('userData.emp_role:', userData.emp_role);
        if (userData.emp_role === 'super') {
            navigate('/system/admin/inquiry');
        } else if (userData.emp_role === 'admin') {
            navigate('/company/admin/member');
        } else if (userData.emp_role === 'user') {
            navigate('/company/user');
        }
    }

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
            {renderMenu(userData)}
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
        </nav>
    );
};

export default Menubar;
