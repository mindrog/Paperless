import React, { useEffect, useRef, useState } from 'react'
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
            console.log("emp: ", emp);
        } catch (error) {
            console.error("Error fetching employee data from localStorage: ", error);
        }
    }, [name]);

    // 검색 태그 상태
    const [showSelectInput, setShowSelectInput] = useState(true);

    // 검색 버튼 클릭 시
    const selectToggle = () => {
        console.log('showSelectInput: ', showSelectInput);
        setShowSelectInput(!showSelectInput);
    };

    // 채팅 메시지 작성 내용
    const [inputValue, setInputValue] = useState('');

    // 이모지 토글 상태
    const [isEmojiToggle, setIsEmojiToggle] = useState(false);

    // 이모지 토글 상태 변환 메서드
    const emojiToggle = (e) => {
        setIsEmojiToggle(!isEmojiToggle);
    };

    // 이모지 선택 시 메서드
    const emojiClick = (selectEmoji, e) => {
        setInputValue(preInputValue => preInputValue + selectEmoji.emoji);
    };

    // emojiRef 참조 변수
    const emojiRef = useRef(null);

    // emojiButtonRef 참조 변수
    const emojiButtonRef = useRef(null);

    // 특정 영역 외 클릭을 감지하여 searchRef 상태 업데이트
    useEffect(() => {
        // 특정 영역 외 클릭 시 이벤트
        function handleFocusOutside(e) {
            // emojiRef.current: emojiRef를 참조하고 있는 DOM 요소가 실제 마운트 되어있는지 검사
            // e.target: 클릭한 요소
            if (emojiRef.current && !emojiRef.current.contains(e.target) && !emojiButtonRef.current.contains(e.target)) {
                setIsEmojiToggle(false);
            }
        }

        // 특정 영역 외 이벤트 리스너 추가
        document.addEventListener("mousedown", handleFocusOutside);

        return () => {
            // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
            document.removeEventListener("mousedown", handleFocusOutside);
        };
    }, [emojiRef]);

    return (
        <>
            <Helmet>
                <link rel="icon" type="image/png" href="/img/final_favicon.png" sizes="16x16" />
                <title>{name}님과의 채팅</title>
            </Helmet>
            <div className="container-xl" style={{ padding: '0' }}>
                <div className={styles.chatting_container}>
                    <header>{emp ? (
                        <div className={styles.header_profile}>
                            <div className={styles.header_profile_img}>
                                <img src={emp.profile} alt="Profile" className={styles.image} />
                            </div>
                            <div className={styles.header_profile_container}>
                                <div className={styles.header_profile_info}>
                                    <div className={styles.header_profile_dept}>
                                        <p>{emp.dept}</p>
                                    </div>
                                    <div className={styles.header_profile_name}>
                                        <p>{emp.name} {emp.posi}</p>
                                    </div>
                                </div>
                                <div className={styles.select_chatting}>
                                    <input type='text' className={`${styles.select_input} ${showSelectInput? styles.select_input_show:styles.select_input_hide}`} placeholder='내용을 입력해주세요.'></input>
                                    <Button className={styles.select_chattingButton} onClick={selectToggle}><i class="material-icons">search</i></Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <h1>Loading chatting ...</h1>
                    )}
                    </header>
                    <div className={styles.main_container}>
                        
                    </div>
                    <div className={`${styles.input_emojiPickerDiv} ${styles.epr_c90x4z} ${styles['epr_-6npj90']}`} style={{ display: isEmojiToggle ? 'block' : 'none' }} ref={emojiRef}>
                        <EmojiPicker className={styles.input_emojiPicker_css} onEmojiClick={emojiClick} />
                    </div>
                    <footer>
                        <div className={styles.input_message}>
                            <div className={styles.input_message_emoji}>
                                <Button ref={emojiButtonRef} className={styles.input_message_emojiButton} onClick={emojiToggle}><i class="material-icons">face</i></Button>
                            </div>
                            <input type='text' value={inputValue} onChange={(e) => { setInputValue(e.target.value) }} placeholder='메시지를 입력하세요'></input>
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