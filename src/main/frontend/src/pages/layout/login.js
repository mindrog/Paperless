import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../../img/logo-img.png';

import '../../styles/layout/login.css';
import '../../styles/style.css';


function Login() {
    return (
       
            <div className='loginForm_container'>

                <form className='loginForm'>
                    <img src={logo} className='loginForm_logo'></img>
                    <div className='subtitle'>
                    <p className='input_id_sub'>아이디</p>
                    </div>
                    <input type='text' className='input_id'>

                    </input>
                    <div className='subtitle'>
                    <p className='input_id_sub'>비밀번호</p>
                    </div>
                    <input type='password' className='input_pw'>

                    </input>
                    <button type='submit' className='login_btn'>
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