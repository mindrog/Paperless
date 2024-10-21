import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../../img/logo-img.png';

import '../../styles/layout/login.css';
import '../../styles/style.css';


function Email_Auth () {
    return (
        <div className='loginForm_container'>

                <form className='emailForm'>
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
                    <button type='button' className='auth_btn'>
                        확인
                    </button>
                    
                </form>

            </div>
    );
}

export default Email_Auth ;