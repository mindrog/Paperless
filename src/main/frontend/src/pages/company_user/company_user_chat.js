import React, { useState } from 'react';
import styles from '../../styles/company/company_chat.module.css';
import OrgChart from '../layout/org_chart';

function Company_user_chat() {
    // 채팅 목록 불러오기 (DB 연결 시)
    // const [chatList, setChatList] = useState([]);

    // 채팅 목록
    const chatList = [
        { profile: 'https://via.placeholder.com/150', name: '장원영', content: '오늘 점심 뭐 먹지?', lastTime: '2024-10-15 11:30' },
        { profile: 'https://via.placeholder.com/150', name: '박보영', content: '대리님, 프레젠테이션 자료...', lastTime: '2024-10-15 09:15' },
        { profile: 'https://via.placeholder.com/150', name: '박보검', content: '대리님, 요청하신 파일 송부...', lastTime: '2024-10-14 16:00' },
        { profile: 'https://via.placeholder.com/150', name: '전지현', content: '안녕하세요, 대리님. 전지현입니다.', lastTime: '2024-10-14 14:32' },
        { profile: 'https://via.placeholder.com/150', name: '이도현', content: '대리님, 지난 달 매출 정리하신 파일...', lastTime: '2024-10-11 11:30' },
        { profile: 'https://via.placeholder.com/150', name: '김태리', content: '대리님, 안녕하세요. 오늘 회의 참석 가능하실까요?', lastTime: '2024-10-10 10:30' },
        { profile: 'https://via.placeholder.com/150', name: '강동원', content: '대리님, 커피 어떤 거 드실래요?', lastTime: '2024-10-09 09:00' },
    ];

    return (
        <div className="container-xl">
            <div className={styles.chatContainer}>
                <div className={styles.selectOrgChart}>
                    <input type='text' placeholder='성명, 직급, 부서명 검색'></input>
                    <button><i className="material-icons">search</i></button>
                </div>
                <div className={styles.list}>
                    <div className={styles.orgChart}>
                        <div className={styles.orgChart_title}>
                            <h3>조직도</h3>
                        </div>
                        <div className={styles.orgChart_content}>
                            <OrgChart />
                        </div>
                    </div>
                    <div className={styles.chatList}>
                        <div className={styles.chatList_title}>
                            <h3>채팅 목록</h3>
                        </div>
                        <div className={styles.chatList_content}>
                            {chatList.map((chat, index) => (
                                <div className={styles.eachChat}>
                                    {chat.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Company_user_chat;