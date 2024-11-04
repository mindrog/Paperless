// src/componentFetch/useFetchData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = (token) => {
  const [userData, setUserData] = useState(null);

  console.log("useFetchData 실행!!!");
  console.log("useFetchData 실행!!! token : " + token);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {

        console.log("useFetchData if문 실행!!!");
        console.log("token : " + token);


        try {
          const response = await axios.get('/api/infolist', {
            headers: { Authorization: `${token}` }
          });

          console.log("Response received:", response); // 응답 객체 전체 출력
          const data = response.data;
          console.log("Data extracted from response:", data); // 추출된 데이터 확인

          setUserData(data); // 데이터 설정
        } catch (error) {
          console.error('Error fetching employee data:', error.message);
          if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
          }
          setUserData(null);
        }
      } else {
        console.log('Token is missing.');

        console.log("useFetchData else 실행!!!");
        console.log("token : " + token);
      }
    };
    fetchUserData();
  }, [token]);

  return userData;
};

export default useFetchData;
