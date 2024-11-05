// src/layout/org_chart.js
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useDrag } from 'react-dnd';
import styles from '../../styles/layout/org_chart.module.css';
import useFetchUserInfo from '../../componentFetch/useFetchUserInfo';

const ITEM_TYPE = 'ITEM';

const OrgChart = forwardRef((props, ref) => {
    const [isDropdown, setIsDropdown] = useState({});
    const { showModal, selectedUser, onMemberClick = () => { }, enableDrag = false } = props;

    const token = localStorage.getItem('jwt');
    const menuList = useFetchUserInfo(token);

    // 모달이 닫힐 때 상태 초기화
    useEffect(() => {
        if (!showModal) {
            setIsDropdown({});
        }
    }, [showModal]);

    useImperativeHandle(ref, () => ({
        closeAllDropdowns,
    }));

    const toggleDropdown = (key) => {
        setIsDropdown((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const closeAllDropdowns = () => setIsDropdown({});

    const DraggableWrapper = ({ data, children }) => {
        const [{ isDragging }, drag] = useDrag({
            type: ITEM_TYPE,
            item: data, // 데이터 직접 전달
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        });

        return (
            <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
                {children}
            </div>
        );
    };

    // 선택된 사용자 드롭다운 열기 및 강조 표시
    useEffect(() => {
        console.log('selectedUser:', selectedUser);
        if (selectedUser) {
            // selectedUser의 부서와 팀 이름 찾기
            const { dept_name, dept_team_name } = selectedUser;

            // 부서와 팀 이름을 기준으로 드롭다운 열기
            setIsDropdown((prev) => {
                const newDropdownState = { ...prev };
                newDropdownState[dept_name] = true; // 부서 이름 기준으로 열기
                if (dept_team_name) {
                    newDropdownState[dept_team_name] = true; // 팀 이름 기준으로 열기
                }
                return newDropdownState;
            });
        } else {
            setIsDropdown({});
        }
    }, [selectedUser]);

    // 특정 사용자를 강조 표시하는 함수
    const highlightUser = (user) => {
        const userElement = document.getElementById(`user-${user.emp_no}`);
        if (userElement) {
            userElement.style.background = 'yellow';
        } else {
            console.error(`User element not found for emp_no: ${user.emp_no}`);
        }
    };

    // 드롭다운이 열렸을 때 사용자 강조 표시
    useEffect(() => {
        if (selectedUser) {
            const { dept_name, dept_team_name } = selectedUser;

            // 부서와 팀 드롭다운이 열렸는지 확인
            const isDeptOpen = isDropdown[dept_name];
            const isTeamOpen = dept_team_name ? isDropdown[dept_team_name] : true;

            if (isDeptOpen && isTeamOpen) {
                // DOM이 업데이트된 후에 실행
                highlightUser(selectedUser);
            }
        }
    }, [isDropdown, selectedUser]);

    const renderMenu = (menu) => (
        <li key={menu.deptName} style={{ listStyle: 'none', marginBottom: '10px' }}>
            <DraggableWrapper data={{ deptName: menu.deptName, type: 'department' }}>
                <button onClick={() => toggleDropdown(menu.deptName)}>
                    {isDropdown[menu.deptName] ? '🗂️' : '🗂️'} {menu.deptName}
                </button>
            </DraggableWrapper>
            {isDropdown[menu.deptName] && (
                <ul>
                    {menu.teams.map((team) => (
                        <li key={team.teamName} style={{ listStyle: 'none' }}>
                            <DraggableWrapper data={{ teamName: team.teamName, deptName: menu.deptName, type: 'team' }}>
                                <button onClick={() => toggleDropdown(team.teamName)}>
                                    {isDropdown[team.teamName] ? '📂' : '📁'} {team.teamName}
                                </button>
                            </DraggableWrapper>
                            {isDropdown[team.teamName] && (
                                <ul>
                                    {team.members.map((member) => (
                                        <li key={member.emp_code} style={{ listStyle: 'none' }} id={`user-${member.emp_no}`}>
                                            <DraggableWrapper data={member ? { ...member, type: 'employee' } : { type: 'employee' }}>
                                                <button onClick={() => onMemberClick(member)}>
                                                    🧑‍💼 {member.posi_name} {member.emp_name}
                                                </button>
                                            </DraggableWrapper>

                                            {/* <DraggableWrapper data={{ ...member, type: 'employee' }}>
                                                <button onClick={() => onMemberClick(member)}>
                                                    🧑‍💼 {member.posi_name} {member.emp_name}
                                                </button>
                                            </DraggableWrapper> */}
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

    return (
        <div className={styles.container_orgChart}>
            <ul className={styles.orgChartList}>
                {Array.isArray(menuList) && menuList.length > 0 ? (
                    menuList.map((menu) =>
                        menu && menu.deptName && Array.isArray(menu.teams) ? renderMenu(menu) : null
                    )
                ) : (
                    <li>조직도 데이터를 불러오는 중입니다...</li>
                )}
                {/* {Array.isArray(menuList) && menuList.length > 0 ? (
                    menuList.map((menu) => renderMenu(menu))
                ) : (
                    <li>조직도 데이터를 불러오는 중입니다...</li>
                )} */}
            </ul>
        </div>
    );
});

export default OrgChart;
