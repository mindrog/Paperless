import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from '../../styles/layout/org_chart.module.css';
import useFetchUserInfo from '../../componentFetch/useFetchUserInfo';

const OrgChart = forwardRef((props, ref) => {
    const [isDropdown, setIsDropdown] = useState({});

    const token = localStorage.getItem('jwt');
    

    const { selectedUser, onMemberClick = () => { } } = props;
    const menuList = useFetchUserInfo(token);
    
    useImperativeHandle(ref, () => ({
        closeAllDropdowns,
    }));

    const toggleDropdown = (key) => {
        setIsDropdown((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const closeAllDropdowns = () => {
        setIsDropdown({});
    };

    const handleDragStart = (e, employee) => {
        e.dataTransfer.setData('employee', JSON.stringify(employee));
        console.log('Dragging:', employee);
    };

    // 선택된 사용자 드롭다운 열기 및 강조 표시 
    useEffect(() => {
        console.log('selectedUser:', selectedUser);
        if (selectedUser) {
            // selectedUser의 부서와 팀 이름 찾기
            const { emp_dept_name } = selectedUser;
            // "구매부서 - 구매팀" 분리해서 저장
            const deptAndTeam = emp_dept_name.split(' - ');

            // 부서와 팀 이름을 기준으로 드롭다운 열기
            setIsDropdown((prev) => {
                const newDropdownState = { ...prev };
                // 부서 이름 기준으로 열기
                newDropdownState[deptAndTeam[0]] = true;
                if (deptAndTeam[1]) {
                    // 팀 이름 기준으로 열기
                    newDropdownState[deptAndTeam[1]] = true;
                }
                return newDropdownState;
            });

            // 강조 표시
            highlightUser(selectedUser);
        } else {
            setIsDropdown({});
        }
    }, [selectedUser]);

    // 강조 표시 메서드
    const highlightUser = (user) => {
        const userElement = document.getElementById(`user-${user.emp_no}`);
        if (userElement) {
            userElement.style.background = 'yellow';
        } else {
            console.error(`User element not found for emp_no: ${user.emp_no}`);
        }
    };

    const renderMenu = (menu) => {
        return (
            <li key={menu.deptName} style={{ listStyle: 'none', marginBottom: '10px' }}>
                <button onClick={() => toggleDropdown(menu.deptName)}>
                    {isDropdown[menu.deptName] ? '📂' : '📁'} {menu.deptName}
                </button>
                {isDropdown[menu.deptName] && (
                    <ul style={{ marginLeft: '20px' }}>
                        {Object.entries(menu.teams).map(([teamName, members]) => (
                            <li key={teamName} style={{ marginLeft: '20px', listStyle: 'none' }}>
                                <button onClick={() => toggleDropdown(teamName)}>
                                    {isDropdown[teamName] ? '📂' : '📁'} {teamName}
                                </button>
                                {isDropdown[teamName] && Array.isArray(members) && (
                                    <ul style={{ marginLeft: '20px' }}>
                                        {members.map((member) => (
                                            <li key={member.emp_code} style={{ listStyle: 'none' }} id={`user-${member.emp_no}`}>
                                                <button draggable onClick={() => onMemberClick(member)} onDragStart={(e) => handleDragStart(e, member)}>
                                                    🧑‍💼 {member.emp_name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}

                    </ul>
                )}
            </li>
        );
    };


    return (
        <div className={styles.container_orgChart}>
            <ul className={styles.orgChartList}>
                {Array.isArray(menuList) && menuList.length > 0 ? (
                    menuList.map((menu) => renderMenu(menu))
                ) : (
                    <li>조직도 데이터를 불러오는 중입니다...</li>
                )}
            </ul>
        </div>
    );

});

export default OrgChart;
