import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import styles from '../../styles/company/company_chatting.module.css'
import { Button } from 'react-bootstrap';
import EmojiPicker from 'emoji-picker-react';

function Chatting() {
    // URL에서 가져온 name 저장하는 변수
    const { name } = useParams();

    // 로컬 스토리지에 저장된 emp 데이터 저장하는 변수
    const [emp, setEmp] = useState();

    useEffect(() => {
        try {

            // 로컬 스토리지에 저장된 key: `chatting-emp-${emp.name}`에서 emp.name을 name으로 바꿔서 불러오기
            // → emp를 불러와야하므로 url에서 가져온 name으로 emp 찾기
            const storageEmp = localStorage.getItem(`chatting-emp-${name}`);

            if (storageEmp) {
                // 저장된 emp가 있다면 저장된 문자열을 원래의 객체 형식으로 저장 (여기선 emp)
                setEmp(JSON.parse(storageEmp));
            } else {
                console.warn(`No data found for key chatting-emp-${name}`);
            }
        } catch (error) {
            console.error("Error fetching employee data from localStorage: ", error);
        }
    }, [name]);

    // 채팅 메시지 작성 내용
    const [inputValue, setInputValue] = useState('');

    // 이모지 토글 상태
    const [isEmoji, setIsEmoji] = useState(false);

    // 이모지 토글 상태 변환 메서드
    const emojiToggle = () => {
        setIsEmoji(!isEmoji);
    };

    // 이모지 선택 시 메서드
    const emojiClick = (selectEmoji, e) => {
        console.log('선택한 이모지: ' + selectEmoji.emoji);
        setInputValue(preInputValue => preInputValue + selectEmoji.emoji);
    };

    return (
        <>
            <Helmet>
                <link rel="icon" type="image/png" href="/img/final_favicon.png" sizes="16x16" />
                <title>{name}님과의 채팅</title>
            </Helmet>
            <div className="container-xl" style={{ padding: '0' }}>
                <div className={styles.chatting_container}>
                    <header>{emp ? (
                        <div>
                            <div>
                                <p>
                                    헤더
                                </p>
                            </div>
                        </div>
                    ) : (
                        <h1>Loading chatting ...</h1>
                    )}
                    </header>
                    <div>

                    </div>
                    <div className={`${styles.input_emojiPickerDiv} ${styles.epr_c90x4z} ${styles['epr_-6npj90']}`} style={{display: isEmoji ? 'block' : 'none'}}>
                        <EmojiPicker className={styles.input_emojiPicker_css} onEmojiClick={emojiClick} />
                    </div>
                    <footer>
                        <div className={styles.input_message}>
                            <div className={styles.input_message_emoji}>
                                <Button className={styles.input_message_emojiButton} onClick={emojiToggle}><i class="material-icons">face</i></Button>
                            </div>
                            <input type='text' value={inputValue} onChange={(e) => {setInputValue(e.target.value)}} placeholder='메시지를 입력하세요'></input>
                            <div className={styles.input_message_button}>
                                <Button className={styles.input_message_attachButton}><i class="material-icons">attach_file</i></Button>
                                <Button className={styles.input_message_sendButton}><i class="material-icons">send</i></Button>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default Chatting;