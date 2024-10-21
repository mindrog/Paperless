import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../../img/logo-img.png';

import '../../styles/layout/login.css';
import '../../styles/style.css';


function Email_Auth () {
    return (
        <div className='loginForm_container'>

                <form className='loginForm'>
                    <img src={logo} className='loginForm_logo'></img>
                    <div className='subtitle'>
                    <p className='input_id_sub'>이메일</p>
                    </div>
                    <div className='input_email_cont'>
                    <input type='email' className='input_email' />
                    <button className='input_email_btn'>전송</button> 
                    </div>
                    
                    <div className='subtitle'>
                    <p className='input_id_sub'>인증번호</p>
                    </div>
                    <input type='text' className='input_number'>

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

export default Email_Auth ;