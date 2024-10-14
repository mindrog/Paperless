import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/company/company_mypage.module.css'; 
import {Button,Form,Table} from 'react-bootstrap';

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
                <div className="container text-center">
                    <div className={styles.userInfo}>
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <div className={styles.userIdBox}>
                                    <div className={styles.userIdtitle}>사&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  번</div>
                                    <div className='userId'>&nbsp;20201234</div>
                                </div>
                            </div>

                            <div className={styles.changePossible}>
                                <div className={styles.userNumBox}>
                                    <div className={styles.userNumtitle}>전화번호</div>
                                    <div className='userNum'>010-1234-9876</div>
                                    <Button variant="primary" className={styles.userNumUpdatebtn}>수정</Button>
                                </div>

                                <div className={styles.userPwBox}>
                                    <div className={styles.userPwtitle}>비밀번호</div>
                                    <div className='userPw'>010-1234-9876</div>
                                    <Button variant="primary" className={styles.userPwChangebtn}>변경</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.userAnnualInfobox}>
                {/* <i className="material-symbols-outlined">schedule</i>
                <i className="material-symbols-outlined">event_note</i> */}
                <h3 className={styles.userAnnualInfo_title}>연차 정보</h3>
                <hr className={styles.titlebar}/>
                <div className={styles.tablebox}>
                    <Table className={styles.userAnnualInfoTable}>
                        <tbody>
                            <tr>
                                <td className={styles.infotitle}>총 근무 기간</td>
                                <td className={styles.infoValue}>3년</td>
                                <td className={styles.infotitle}>총 연차 수</td>
                                <td className={styles.infoValue}>15</td>
                            </tr>
                            <tr>
                                <td className={styles.infotitle}>사용된 연차 수</td>
                                <td className={styles.infoValue}>5</td>
                                <td className={styles.infotitle}>사용가능 연차 수</td>
                                <td className={styles.infoValue}>10</td>
                            </tr>
                        </tbody>
                    </Table> 
                </div>
            </div>
            
            
        </div>
    );
}

export default Company_user_mypage ;