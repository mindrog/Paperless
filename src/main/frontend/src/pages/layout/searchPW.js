import React from 'react';

import logo from '../../img/logo-img.png';

import '../../styles/layout/login.css';
import '../../styles/style.css';


function searchPW() {
    return (
       
            <div className='loginForm_container'>

            <form className='searchPWForm'>
                    <img src={logo} className='loginForm_logo'></img>
                    <div className='subtitle'>
                    <p className='input_id_sub'>비밀번호</p>
                    </div>
                    <input type='password' className='input_password' />
                    
                    <div className='subtitle'>
                    <p className='input_id_sub'>비밀번호 확인</p>
                    </div>
                    <input type='text' className='input_passwordchk'>

                    </input>
                    <button type='button' className='auth_btn'>
                        확인
                    </button>
                    
                </form>

            </div>
        
    );
}

export default searchPW;