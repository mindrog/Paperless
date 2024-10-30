// src/componentFetch/useFetchUserInfo.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchUserInfo = (token) => {
  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    const fetchMenuList = async () => {
      if (token) {
        try {
          const response = await axios.post('/api/getMenuList', {}, {
            headers: { Authorization: token }
          });
          const data = response.data;

          console.log('Fetched menu data:', data);

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

  return menuList;
};

export default useFetchUserInfo;
