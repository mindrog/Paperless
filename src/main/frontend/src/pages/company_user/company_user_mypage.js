import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/company/company_mypage.module.css'; 

function Company_user_mypage() {

    const location = useLocation(); 
    const navigate = useNavigate();
    const profileName = location.pathname.toLowerCase().startsWith('/company/admin') 
                        ? '강동원' 
                        : location.pathname.toLowerCase().startsWith('/company/user') 
                        ? '배수지' 
                        : '사용자'; 

    return (
        <div className="container-xl">
            <div className={styles.mypageContainer}>
                <div className={styles.mypageProfil}>
                    <img src="https://via.placeholder.com/150" alt="Profile" className={styles.image}/>
                        <div className={styles.profiltitle}>
                            <p>기획전략팀</p>
                            <div className={styles.titlename}>
                                <div className={styles.userName}>{profileName}</div>
                                <div className={styles.userGrade}>대리</div>
                            </div>
                        </div>
                </div>
                <div className='userInfo'>
                    <div className='userIdBox'>
                        <div className='userIdtitle'>사번</div>
                        <div className='userId'>20201234</div>
                    </div>
                    <div className='userNumBox'>
                        <div className='userNumtitle'>전화번호</div>
                        <div className='userNum'>010-1234-9876</div>
                    </div>
                    <div className='userPwBox'>
                        <div className='userPwtitle'>비밀번호</div>
                        <div className='userPw'>010-1234-9876</div>
                    </div>
                </div>


            </div>
            
            
        </div>
    );
}

export default Company_user_mypage ;