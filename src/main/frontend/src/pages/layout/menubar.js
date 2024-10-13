import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/layout/menubar.module.css'; // CSS 모듈 사용 시

const Menubar = ({ isMenuOpen }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false); // 기안 문서함 상태
    const [isFormDropdownOpen, setIsFormDropdownOpen] = useState(false); // 기안 양식 상태

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleDocDropdown = () => {
        setIsDocDropdownOpen(!isDocDropdownOpen);
    };

    const toggleFormDropdown = () => {
        setIsFormDropdownOpen(!isFormDropdownOpen);
    };

    const navigate = useNavigate();

    const handleEmployeeMypage = () => {
        navigate('/Company/user/mypage');
    };

    const handleEmployeeManagementClick = () => {
        navigate('/Company/admin/member');
    };

    const handleEmployeeCalendar = () => {
        navigate('/handleEmployeeCalendarClick');
     }

    const handleEmployeeDraftList = () => {
        navigate('/Company/user/draft/list');
    }

    const handleEmployeeDraftWrite = () => {
        navigate('/Company/user/draft/write');
    }


    return (
        <nav className={`${styles.menubar} ${isMenuOpen ? styles.showMenu : ''}`}>
            <div className={styles.menubar}>
                <div className={styles.profil}>
                    <div className={styles.profilbox}>
                        <div className={styles.profiltitle}>
                            <img src="https://via.placeholder.com/150" alt="Profile" className={styles.image} />
                            <h2>배수지</h2>
                        </div>
                        <i className="material-icons noti">notifications</i>
                        <i className="material-icons mail">mail</i>
                        <i className="material-icons chat">chat_bubble</i>
                    </div>
                </div>

                <ul className={styles.menuList}>
                    <li className={styles.dropdown}>
                        <button onClick={handleEmployeeMypage} className={styles.sublist}>
                            🧑‍💼 마이페이지
                        </button>
                    </li>
                    <li className={styles.dropdown}>
                        <button onClick={toggleDropdown} className={styles.dropdownToggle}>
                            {/* 상위 드롭다운 메뉴 기안 관리 */}
                            {/* <i className={`material-icons ${styles.arrowIcon} ${isDropdownOpen ? styles.open : ''}`}>
                                {isDropdownOpen ? 'chevron_right' : 'expand_more'}
                            </i> */}
                            📑 기안 관리
                        </button>
                        {/* 기안 관리 하위 메뉴 */}
                        {isDropdownOpen && (
                            <div className={styles.subDropdownMenu}>
                                <ul>
                                    {/* 기안 문서함 */}
                                    <li>
                                        <button onClick={toggleDocDropdown} className={styles.submenu}>
                                            <i className={`material-icons ${styles.arrowIcon} ${isDocDropdownOpen ? styles.open : ''}`}>
                                                {isDocDropdownOpen ? 'chevron_right' : 'expand_more'}
                                            </i>
                                            🗂️ 기안 문서함
                                        </button>
                                        {isDocDropdownOpen && (
                                            <ul className={styles.innerSubDropdownMenu}>
                                                <li><button className={styles.lastsubmenu} onClick={handleEmployeeDraftList}>📁 전체 문서함</button></li>
                                                <li><button className={styles.lastsubmenu} onClick={handleEmployeeDraftList}>📁 임시 저장함</button></li>
                                                <li><button className={styles.lastsubmenu} onClick={handleEmployeeDraftList}>📁 결재 문서함</button></li>
                                            </ul>
                                        )}
                                    </li>
                                    {/* 기안 양식 */}
                                    <li>
                                        <button onClick={toggleFormDropdown} className={styles.submenu}>
                                            <i className={`material-icons ${styles.arrowIcon} ${isFormDropdownOpen ? styles.open : ''}`}>
                                                {isFormDropdownOpen ? 'chevron_right' : 'expand_more'}
                                            </i>
                                            📑 기안 양식
                                        </button>
                                        {isFormDropdownOpen && (
                                            <ul className={styles.innerSubDropdownMenu}>
                                                <li><button className={styles.lastsubmenu} onClick={handleEmployeeDraftWrite}>📄 업무 보고 기안</button></li>
                                                <li><button className={styles.lastsubmenu} onClick={handleEmployeeDraftWrite}>📄 근태 신청 기안</button></li>
                                                <li><button className={styles.lastsubmenu} onClick={handleEmployeeDraftWrite}>📄 구매 신청 기안</button></li>
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
                    <li className={styles.dropdown}>
                        <button onClick={handleEmployeeManagementClick} className={styles.sublist}>
                            ⚙️ 직원 관리
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Menubar;
