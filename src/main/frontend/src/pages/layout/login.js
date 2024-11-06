import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData, setUserPosi } from '../../store/userSlice';
import logo from '../../img/logo-img.png';
import axios from 'axios';

import '../../styles/layout/login.css';
import '../../styles/style.css';

function Login() {
    const [empId, setEmpId] = useState('');
    const [empPw, setEmpPw] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleIdChange = (event) => {
        setEmpId(event.target.value);
    };

    const handlePwChange = (event) => {
        setEmpPw(event.target.value);
    };

    const postLogin = async (empId, empPw) => {
        try {
            const response = await axios.post('http://localhost:8080/login', {
                username: empId,
                password: empPw,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });
    
            const token = response.headers['authorization'];
    
            if (token) {
                localStorage.setItem('jwt', token); // JWT 토큰 저장
                console.log('토큰 저장 완료!:', localStorage.getItem('jwt'));
    
                const userInfoResponse = await axios.get('http://localhost:8080/api/userinfo', {
                    headers: {
                        'Authorization': token
                    }
                });
    
                const userData = userInfoResponse.data;
                dispatch(setUserData(userData)); // Redux 상태에 사용자 데이터 저장
                const userPosiResponse = await axios.get('http://localhost:8080/api/userposi', {
                    headers: {
                        'Authorization': token
                    }
                });
                const userPosi =userPosiResponse.data;
                dispatch(setUserPosi(userPosi));
                
                // Navigate 로직
                if (userData.emp_role === "super") {
                    navigate("/system/admin/inquiry");
                } else if (userData.emp_role === "admin") {
                    navigate("/company/admin/member");
                } else {
                    navigate("/company/user");
                }
            } else {
                console.error('토큰을 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('로그인 실패:', error.response ? error.response.data : error.message);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        postLogin(empId, empPw);
    };

    return (
        <div className='loginForm_container'> 
            <form className='loginForm' onSubmit={handleSubmit}>
                <img src={logo} className='loginForm_logo' alt="Logo" />
                <div className='subtitle'>
                    <p className='input_id_sub'>아이디</p>
                </div>
                <input type="text"
                    className='input_id'
                    id="empId"
                    value={empId}
                    onChange={handleIdChange} />

                <div className='subtitle'>
                    <p className='input_id_sub'>비밀번호</p>
                </div>
                <input type="password"
                    className='input_pw'
                    id="empPw"
                    value={empPw}
                    onChange={handlePwChange} />

                <button type="submit" className="login_btn">
                    로그인
                </button>
                <div className='searchPW_container'>    
                    <p className='searchPW'> 비밀번호를 잊으셨나요? </p>
                    <Link to={'/email_Auth'} className='searchPW_link'>비밀번호 찾기</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;
