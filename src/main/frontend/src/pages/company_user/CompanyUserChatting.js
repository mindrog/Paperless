import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import styles from '../../styles/company/company_chatting.module.css'

function Chatting() {
    // URL에서 가져온 name 저장하는 변수
    const { name } = useParams();
    // 로컬 스토리지에 저장된 emp 데이터 저장하는 변수
    const [emp, setEmp] = useState();

    useEffect(() => {
        // 로컬 스토리지에 저장된 key: `chatting-emp-${emp.name}`에서 emp.name을 name으로 바꿔서 불러오기
        // → emp를 불러와야하므로 url에서 가져온 name으로 emp 찾기
        const storageEmp = localStorage.getItem(`chatting-emp-${name}`);

        if (storageEmp) {
            // 저장된 emp가 있다면 저장된 문자열을 원래의 객체 형식으로 저장 (여기선 emp)
            setEmp(JSON.parse(storageEmp));
        }
    }, []);

    return (
        <div>
            <Helmet>
                <link rel="icon" type="image/png" href="/img/final_favicon.png" sizes="16x16" />
                <title>{name}님과의 채팅</title>
            </Helmet>
            <div className="container-xl">
                <div className={styles.chatting_container}>
                    <header>
                        {emp ? (
                            <div>
                                <h1>{emp.name}님과의 채팅</h1>
                                <p>Department: {emp.dept}</p>
                                <p>Email: {emp.email}</p>
                            </div>
                        ) : (
                            <p>Loading chat data...</p>
                        )}
                    </header>
                </div>
            </div>
        </div>
    );
};

export default Chatting;