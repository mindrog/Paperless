import React from 'react';

import logo from '../../img/logo-img.png';

import '../../styles/layout/login.css';
import '../../styles/style.css';


function searchPW() {
    return (
       
            <div className='loginForm_container'>

                <form className='loginForm'>
                    <img src={logo} className='loginForm_logo'></img>
                    <input type='text' className='input_id'>

                    </input>
                    <input type='password' className='input_pw'>

                    </input>
                    <button type='submit' className='login_btn'>
                        로그인
                    </button>
                    <div className='searchPW_container'>
                        <p className='searchPW'> 비밀번호를 잊으셨나요? </p>
                        <a className='searchPW_link'>비밀번호 찾기</a>
                    </div>
                </form>

            </div>
        
    );
}

export default searchPW;