import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useDrag } from 'react-dnd';
import styles from '../../styles/layout/org_chart.module.css';
import useFetchUserInfo from '../../componentFetch/useFetchUserInfo';
import DraggableItem from './DraggableItem';
import NonDraggableItem from './NonDraggableItem';

const ITEM_TYPE = 'ITEM'; // 드래그 항목의 타입을 지정

const OrgChart = forwardRef((props, ref) => {
    const [isDropdown, setIsDropdown] = useState({});
    const { showModal, selectedUser, onMemberClick = () => { }, enableDrag = false } = props;

    const token = localStorage.getItem('jwt');
    const menuList = useFetchUserInfo(token);

    // 모달이 닫힐 때 상태 초기화
    useEffect(() => {
        if (!showModal) {
            setIsDropdown({}); // 상태 초기화
        }
    }, [showModal]);

    // 외부에서 전체 드롭다운을 닫는 메서드를 사용할 수 있도록 설정
    useImperativeHandle(ref, () => ({
        closeAllDropdowns,
    }));

    // 드롭다운을 토글하는 함수
    const toggleDropdown = (key) => {
        setIsDropdown((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // 전체 드롭다운을 닫는 함수
    const closeAllDropdowns = () => {
        setIsDropdown({});
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

    // 특정 사용자를 강조 표시하는 함수
    const highlightUser = (user) => {
        const userElement = document.getElementById(`user-${user.emp_no}`);
        if (userElement) {
            userElement.style.background = 'yellow';
        } else {
            console.error(`User element not found for emp_no: ${user.emp_no}`);
        }
    };

    // enableDrag 통해 드래그 기능 사용 여부 확인
    const ItemComponent = enableDrag ? DraggableItem : NonDraggableItem;

    // 조직도에서 각 메뉴 항목을 렌더링하는 함수
    const renderMenu = (menu) => (
        <li key={menu.deptName} style={{ listStyle: 'none', marginBottom: '10px' }}>
            {/* 부서 드래그 가능 */}
            <ItemComponent data={menu} type="department">
                <button onClick={() => toggleDropdown(menu.deptName)}>
                    {isDropdown[menu.deptName] ? '📂' : '📁'} {menu.deptName}
                </button>
            </ItemComponent>
            {isDropdown[menu.deptName] && (
                <ul style={{ marginLeft: '20px' }}>
                    {Object.entries(menu.teams).map(([teamName, members]) => (
                        <li key={teamName} style={{ marginLeft: '20px', listStyle: 'none' }}>
                            {/* 팀 드래그 가능 */}
                            <ItemComponent data={{ teamName, deptName: menu.deptName }} type="team">
                                <button onClick={() => toggleDropdown(teamName)}>
                                    {isDropdown[teamName] ? '📂' : '📁'} {teamName}
                                </button>
                            </ItemComponent>
                            {isDropdown[teamName] && Array.isArray(members) && (
                                <ul style={{ marginLeft: '20px' }}>
                                    {members.map((member) => (
                                        <li key={member.emp_code} style={{ listStyle: 'none' }} id={`user-${member.emp_no}`}>
                                            {/* 직원 드래그 가능 */}
                                            <ItemComponent data={member} type="employee">
                                                <button onClick={() => onMemberClick(member)}>
                                                    🧑‍💼 {member.emp_name}
                                                </button>
                                            </ItemComponent>
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
                    menuList.map((menu) => renderMenu(menu))
                ) : (
                    <li>조직도 데이터를 불러오는 중입니다...</li>
                )}
            </ul>
        </div>
    );
});

export default OrgChart;
