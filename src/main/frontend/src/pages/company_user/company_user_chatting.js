import React from 'react'
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import styles from '../../styles/company/company_chatting.module.css'

function Chatting() {
    // URL에서 채팅 name 불러오기
    const { name } = useParams();

    return (
        <div>
            <Helmet>
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