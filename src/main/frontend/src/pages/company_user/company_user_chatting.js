import React from 'react'
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import styles from '../../styles/company/company_chatting.module.css'

function Chatting() {
    // URL에서 채팅 name 불러오기
    const { name } = useParams();

    // 직원 (더미 데이터)
    const userList = [
        { name: '장원영', dept: '콘텐츠 기획팀', phone: '010-1234-1234', email: 'jang0101@naver.com' },
        { name: '박보영', dept: '콘텐츠 기획팀', phone: '010-2345-2345', email: 'boyoung0202@naver.com' },
        { name: '박보검', dept: '콘텐츠 기획팀', phone: '010-3456-3456', email: 'gumgum0303@gmail.com' },
        { name: '전지현', dept: '콘텐츠 기획팀', phone: '010-4567-4567', email: 'jjh0404@naver.com' },
        { name: '이도현', dept: '콘텐츠 기획팀', phone: '010-5678-5678', email: 'dodo0505@gmail.com' },
        { name: '김태리', dept: '콘텐츠 기획팀', phone: '010-6789-6789', email: 'kimlee0606@gmail.com' },
        { name: '강동원', dept: '콘텐츠 기획팀', phone: '010-7890-7890', email: 'dongwon0707@naver.com' },
    ];

    return (
        <div>
            <Helmet>
                <link rel="icon" type="image/png" href="/img/final_favicon.png" sizes="16x16" />
                <title>{name}님과의 채팅</title>
            </Helmet>
            <div className="container-xl">
                <div className={styles.chatting_container}>
                    {name}님과의 채팅 중입니다!
                </div>
            </div>
        </div>
    );
};

export default Chatting;