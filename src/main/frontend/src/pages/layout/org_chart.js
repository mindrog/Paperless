import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import styles from '../../styles/layout/org_chart.module.css';
import axios from 'axios';

const OrgChart = forwardRef((props, ref) => {
    const [isDropdown, setIsDropdown] = useState({});
    const [menuList, setMenuList] = useState({});
    const token = localStorage.getItem('jwt');

    useEffect(() => {
        const fetchMenuList = async () => {
            if (token) {
                try {
                    const response = await axios.post('/api/getMenuList', {}, {
                        headers: { 'Authorization': token }
                    });
                    const data = response.data;

                    console.log('Fetched menu data:', data); // 데이터 구조 확인

                    if (data && typeof data === 'object') {
                        const groupedData = Object.entries(data).map(([deptName, employees]) => ({
                            deptName,
                            teams: employees.reduce((teams, employee) => {
                                const teamName = employee.dept_team_name || '팀 없음';
                                if (!teams[teamName]) {
                                    teams[teamName] = [];
                                }
                                teams[teamName].push(employee);
                                return teams;
                            }, {})
                        }));

                        setMenuList(groupedData);
                        console.log('Grouped menu list:', groupedData);
                    } else {
                        console.error("Data is not a valid object:", data);
                        setMenuList([]); // 빈 배열 설정
                    }
                } catch (error) {
                    console.error('Error fetching menu list:', error);
                    setMenuList([]);
                }
            } else {
                console.log('토큰이 없습니다.');
            }
        };

        fetchMenuList();
    }, [token]);


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
                                        <li key={member.emp_code} style={{ listStyle: 'none' }}>
                                            🧑‍💼 {member.emp_name}
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
