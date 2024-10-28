import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux';
import styles from '../../styles/layout/org_chart.module.css';
import axios from 'axios';

const OrgChart = forwardRef((props, ref) => {
    const [isDropdown, setIsDropdown] = useState([]);
    const [menuList, setMenuList] = useState([]);

    // 조직도 데이터
    const userData = useSelector((state) => state.user.data);

    // `localStorage`에서 `jwt` 값을 가져오기
    const token = localStorage.getItem('jwt');

    useEffect(() => {
        const fetchMenuList = async () => {
            if (token) {
                try {
                    const response = await axios.post('/api/getMenuList',
                        {},  // 빈 객체로 전달하거나 필요한 요청 데이터를 여기에 전달
                        {
                            headers: {
                                'Authorization': token
                            }
                        }
                    );
                    setMenuList(response.data);
                    console.log('Menu list fetched:', response.data);
                } catch (error) {
                    console.error('Error fetching menu list:', error);
                }
            } else {
                console.log('토큰이나 사용자 데이터가 없습니다.');
            }
        };

        fetchMenuList();
    }, [token, userData]);

    useImperativeHandle(ref, () => ({
        closeAllDropdowns,
    }));

    const toggleDropdown = (menu) => {
        setIsDropdown((menuState) => ({
            ...menuState,
            [menu]: !menuState[menu]
        }));
    };

    const closeAllDropdowns = () => {
        setIsDropdown((prevState) =>
            Object.keys(prevState).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {})
        );
    };

    const handleDragStart = (e, person) => {
        e.dataTransfer.setData('person', JSON.stringify(person)); // 드래그한 데이터를 저장
        console.log('Dragging:', person);
    };

    const renderMenu = (menu) => {
        return (
            <li key={menu.department} style={{ listStyle: 'none' }}>
                <strong>{menu.department}</strong>
                {menu.subMenu && (
                    <ul>
                        {menu.subMenu.map((team) => (
                            <li key={team.name} style={{ marginLeft: '20px', listStyle: 'none' }}>
                                <button onClick={() => toggleDropdown(team.name)}>
                                    {isDropdown[team.name] ? '📂' : '📁'} {team.name}
                                </button>
                                {isDropdown[team.name] && team.members && (
                                    <ul style={{ marginLeft: '20px' }}>
                                        {team.members.map((member) => (
                                            <li key={member.key} style={{ listStyle: 'none' }}>
                                                🧑‍💼 {member.name}
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
            {menuList.map((menu) => renderMenu(menu))}
        </ul>
    </div>
    );
});


export default OrgChart;