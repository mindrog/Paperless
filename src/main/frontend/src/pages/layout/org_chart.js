// src/layout/org_chart.js
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useDrag } from 'react-dnd';
import styles from '../../styles/layout/org_chart.module.css';
import useFetchUserInfo from '../../componentFetch/useFetchUserInfo';

const ITEM_TYPE = 'ITEM';

const OrgChart = forwardRef((props, ref) => {
    const [isDropdown, setIsDropdown] = useState({});
    const { showModal, selectedUser, onMemberClick = () => {}, enableDrag = false } = props;

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
                                        <li key={member.emp_code} style={{ listStyle: 'none' }}>
                                            <DraggableWrapper data={{ ...member, type: 'employee' }}>
                                                <button onClick={() => onMemberClick(member)}>
                                                    🧑‍💼 {member.posi_name} {member.emp_name}
                                                </button>
                                            </DraggableWrapper>
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
