// src/componentFetch/useFetchData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = (token) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await axios.post('/api/infolist', {}, {
            headers: { Authorization: token }
          });

          console.log("Response received:", response); // 응답 객체 전체 출력
          const data = response.data;
          console.log("Data extracted from response:", data); // 추출된 데이터 확인

          setUserData(data); // 데이터 설정
        } catch (error) {
          console.error('Error fetching employee data:', error);
          setUserData(null);
        }
      } else {
        console.log('Token is missing.');
      }
    };
    fetchUserData();
  }, [token]);

  return userData;
};

export default useFetchData;
