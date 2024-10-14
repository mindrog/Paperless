import React from 'react';
import styles from '../../styles/company/company_chat.module.css';
import OrgChart from '../layout/org_chart';

function Company_user_chat() {
    return (
        <div className="container-xl">
            <div className={styles.chatContainer}>
                <div className={styles.selectChat}>
                    <input type='text' placeholder='성명, 직급, 부서명 검색'></input>
                    <button><i className="material-icons">search</i></button>
                </div>
                <div className={styles.list}>
                    <div className={styles.orgChart}>
                        <div className={styles.orgChart_title}>
                            <h2>조직도</h2>
                        </div>
                        <div className={styles.orgChart_content}>
                            <OrgChart />
                        </div>
                    </div>
                    <div className={styles.chatList}>
                        <div className={styles.chatList_title}>
                            <h2>채팅 목록</h2>
                        </div>
                        <div className={styles.chatList_content}>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Company_user_chat;