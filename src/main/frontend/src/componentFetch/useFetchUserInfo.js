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
            // teams를 객체가 아닌 배열로 구성
            const groupedData = Object.entries(data).map(([deptName, deptData]) => ({
              deptName,
              dept_code: deptData.dept_code || null,
              teams: (Array.isArray(deptData.employees) ? deptData.employees : []).reduce((result, employee) => {
                const teamName = employee.dept_team_name || '팀 없음';
                const teamIndex = result.findIndex((team) => team.teamName === teamName);

                if (teamIndex === -1) {
                  result.push({ teamName, members: [employee] });
                } else {
                  result[teamIndex].members.push(employee);
                }
                return result;
              }, [])
            }));

            setMenuList(groupedData);
            console.log('Grouped menu list with dept_code:', groupedData);

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
