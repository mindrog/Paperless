import React, { useState } from 'react';
import styles from '../../styles/company/company_chat.module.css';
import OrgChart from '../layout/org_chart';

function Company_user_chat() {
    // 채팅 목록 불러오기 (DB 연결 시)
    // const [chatList, setChatList] = useState([]);

    // 채팅 목록
    const chatList = [
        {
            profile: 'https://via.placeholder.com/75', name: '장원영', content: `수지야
            오늘 점심 뭐 먹지?`, lastTime: '2024-10-15 11:30', unread: 2
        },
        {
            profile: 'https://via.placeholder.com/75', name: '박보영', content: `대리님, 프레젠테이션 자료 이메일로 전송했습니다.
            확인 부탁드립니다.`, lastTime: '2024-10-15 09:15', unread: 1
        },
        {
            profile: 'https://via.placeholder.com/75', name: '박보검', content: `대리님, 요청하신 파일 보내드렸습니다.
            확인하시고, 각 부서에 전달 바랍니다.
            회의할 때 10부만 복사해주세요.`, lastTime: '2024-10-14 16:00', unread: 0
        },
        {
            profile: 'https://via.placeholder.com/75', name: '전지현', content: `안녕하세요, 대리님. 
            전지현입니다.
            전화 부탁드립니다.`, lastTime: '2024-10-14 14:32', unread: 0
        },
        {
            profile: 'https://via.placeholder.com/75', name: '이도현', content: `대리님, 지난 달 매출 정리하신 파일 보고서 찾았습니다!
            감사합니다~`, lastTime: '2024-10-11 11:30', unread: 0
        },
        {
            profile: 'https://via.placeholder.com/75', name: '김태리', content: `대리님, 안녕하세요. 
            오늘 회의 참석 가능하실까요?`, lastTime: '2024-10-10 10:30', unread: 0
        },
        { profile: 'https://via.placeholder.com/75', name: '강동원', content: `대리님, 커피 어떤 거 드실래요?`, lastTime: '2024-10-09 09:00', unread: 0 },
        {
            profile: 'https://via.placeholder.com/75', name: '+82 2-1234-5678', content: `[Web발신]
            (광고) 공식몰
            단 하루 100원 판매!`, lastTime: '2024-10-08 12:00', unread: 10
        },
    ];

    return (
        <div className="container-xl">
            <div className={styles.chatContainer}>
                <div className={styles.list}>
                    <div className={styles.orgChart}>
                        <div className={styles.orgChart_title}>
                            <h3>조직도</h3>
                        </div>
                        <div className={styles.orgChart_content}>
                            <div className={styles.selectOrgChart}>
                                <input type='text' placeholder='성명, 직급, 부서명 검색'></input>
                                <button><i className="material-icons">search</i></button>
                            </div>
                            <div className={styles.orgChartUI}>
                                <OrgChart />
                            </div>
                        </div>
                    </div>
                    <div className={styles.chatList}>
                        <div className={styles.chatList_title}>
                            <h3>채팅 목록</h3>
                        </div>
                        <div className={styles.chatList_content}>
                            {chatList.map((chat, index) => (
                                <div className={styles.eachChat}>
                                    <div className={styles.eachChat_profile}>
                                        <img src={chat.profile} alt="Profile" className={styles.image} />
                                    </div>
                                    <div className={styles.eachChat_info}>
                                        <div className={styles.eachChat_row}>
                                            <div className={styles.eachChat_name}>
                                                {chat.name}
                                            </div>
                                            <div className={styles.eachChat_lastTime}>
                                                {chat.lastTime}
                                            </div>
                                        </div>
                                        <div className={styles.eachChat_row}>
                                            <div className={styles.eachChat_content}>
                                                {chat.content}
                                            </div>
                                            <div className={styles.eachChat_unread} style={{ display: chat.unread === 0 ? 'none' : 'block' }}>
                                                {chat.unread}
                                            </div>
                                        </div>
                                    </div>
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