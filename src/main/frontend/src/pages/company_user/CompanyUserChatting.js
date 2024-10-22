import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import styles from '../../styles/company/company_chatting.module.css'
import { Button } from 'react-bootstrap';
import EmojiPicker from 'emoji-picker-react';
import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import useWebSocket from 'react-use-websocket';
import { v4 as uuidv4 } from 'uuid';
import api from '../layout/api';

// .env 파일
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

function Chatting() {
    // 더미 데이터
    // 알고리즘: 연결한 소켓 기준 채팅방에서 불러온 메시지들을 시간 순으로 정리해서 불러온 후 보낸 사람과 받는 사람의 기준으로 로그인 된 아이디와 비교하여 구분 (백엔드 연결 전 : 하드코딩)
    // 메시지 sender: 보낸 사람, recipient: 받는 사람, content: 메시지 내용, count: 읽지 않은 사람(수신 수), state: 메시지 읽음 상태, sendTime: 메시지를 전송한 시간 
    const messageList1 = [
        { sender: '배수지', recipient: '장원영', content: `오늘 뭐 마실래??`, count: 1, state: '읽음', sendTime: '2024-10-10 10:30', },
        { sender: '장원영', recipient: '배수지', content: `나는 아아~`, count: 1, state: '읽음', sendTime: '2024-10-10 10:40', },
        { sender: '배수지', recipient: '장원영', content: `알겠어!!`, count: 1, state: '읽음', sendTime: '2024-10-10 10:45', },
        { sender: '배수지', recipient: '장원영', content: `이따봐~`, count: 1, state: '읽음', sendTime: '2024-10-10 10:45', },
        { sender: '장원영', recipient: '배수지', content: `오키~`, count: 1, state: '읽음', sendTime: '2024-10-10 11:00', },
        { sender: '장원영', recipient: '배수지', content: `커피 잘 마실게~ 고마워!!`, count: 1, state: '읽음', sendTime: '2024-10-10 11:24', },
        {
            sender: '장원영', recipient: '배수지', content: `수지야
            오늘 점심 뭐 먹지?`, count: 1, state: '안읽음', sendTime: '2024-10-15 11:30',
        },
    ];

     // 메시지 목록 상태 변수
     const [messageList, setMessageList] = useState([]);

    // WEBSOCKET_URL 저장 변수
    const [socketUrl] = useState(WEBSOCKET_URL);

    // 메시지를 저장하고 출력하는 변수
    const [message, setMessage] = useState('');

    // 고유한 사용자 아이디를 생성
    const [userId, setUserId] = useState(uuidv4());

    // URL에서 가져온 name 저장하는 변수 (더미 이용한 변수)
    const { name } = useParams();

    // 로컬 스토리지에 저장된 emp 데이터 저장하는 변수 (더미 이용한 변수)
    // 대화 상대 (로그인한 사람과 채팅할 대상)
    const [emp, setEmp] = useState();

    // 돋보기 토글 상태
    const [showSelectInput, setShowSelectInput] = useState(true);

    // 이모지 토글 상태
    const [isEmojiToggle, setIsEmojiToggle] = useState(false);

    // emojiRef 참조 변수
    const emojiRef = useRef(null);

    // emojiButtonRef 참조 변수
    const emojiButtonRef = useRef(null);

    // mainContainerRef 참조 변수
    const mainContainerRef = useRef(null);

    // 보낸 메시지 관리
    // sendMessage: WebSocket 서버로 메시지를 보내는 함수
    //  클라이언트가 서버에 데이터를 전송할 때 사용
    // lastMessage: 서버에서 마지막으로 수신한 메시지
    //  서버에서 메시지가 올 때마다 업데이트
    // readyState: WebSocket의 연결 상태를 나타내는 함수
    //  총 4가지로 0: 연결 시도 중, 1: 연결, 2: 연결 종료 시도 중, 3: 연결 종료
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    // WebSocket 연결 상태
    const connectionStatus = {
        0: '연결 시도 중..',
        1: '연결됨',
        2: '연결 종료 시도 중..',
        3: '연결 종료'
    }[readyState];

    // 돋보기 토글 상태 변환 메서드
    const selectToggle = () => {
        setShowSelectInput(!showSelectInput);
    };

    // 이모지 토글 상태 변환 메서드
    const emojiToggle = (e) => {
        setIsEmojiToggle(!isEmojiToggle);
    };

    // 이모지 선택 시 메서드
    const emojiClick = (selectEmoji, e) => {
        setMessage(preMessage => preMessage + selectEmoji.emoji);
    };

    // 메시지 전송 버튼 메서드
    const handlerSendMessage = async () => {
        if (message) {
            try {
                // REST API를 통해 메시지 전송
                await api.sendMessage({
                    chat_room_no: emp.chat_room_no,
                    chat_sender: userId,
                    chat_recipient: emp.participants,
                    chat_content: message,
                    chat_type: 'text',
                });

                // WebSocket을 통해 메시지를 보내기도 함
                sendMessage(JSON.stringify({ action: 'sendMessage', message, userId }));
                setMessage(''); // 메시지 입력란 초기화
            } catch (error) {
                console.error('메시지 전송 중 오류 발생:', error);
            }
        }
    };

    // 가장 마지막에 읽은 메시지부터 보여주기
    const scrollToBottom = () => {
        const mainContainer = mainContainerRef.current;
        if (mainContainer) {
            mainContainer.scrollTop = mainContainer.scrollHeight;
        }
    };

    // 컴포넌트가 마운트 또는 새 메시지가 추가될 때 스크롤 맨 아래로 이동
    // 메시지 목록이 업데이트 될 때마다 실행
    useEffect(() => {
        scrollToBottom();
    }, [messageList]);

    // readyState가 변경될 때마다 함수를 실행
    useEffect(() => {
        console.log('WEBSOCKET_URL:', WEBSOCKET_URL);

        // 연결 되었을 때
        if (readyState === 1) {
            console.log('연결 성공!');
        }
    }, [readyState]);

    // chat.js에서 emp.name 가져오기
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

    // 특정 채팅방의 모든 메시지 불러오기 (REST API 사용)
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // 특정 채팅방의 메시지 조회
                const chatMessages = await api.getChatMessages(emp.chat_room_no);
                setMessageList(chatMessages);
            } catch (error) {
                console.error('메시지 불러오기 중 오류 발생:', error);
            }
        };

        if (emp) {
            fetchMessages(); // 직원 정보가 존재할 때 메시지 불러오기
        }
    }, [emp]);

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
                                    <div>
                                        <p>연결 확인: {connectionStatus}</p>
                                        <p>수신 확인: {lastMessage ? lastMessage.data : '메시지x '}</p>
                                        <p>사용자 ID: {userId}</p>
                                    </div>
                                    <input type='text' className={`${styles.select_input} ${showSelectInput ? styles.select_input_show : styles.select_input_hide}`} placeholder='내용을 입력해주세요.'></input>
                                    <Button className={styles.select_chattingButton} onClick={selectToggle}><i class="material-icons">search</i></Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <h1>채팅 불러오는 중 ...</h1>
                    )}
                    </header>
                    <div className={styles.main_container} ref={mainContainerRef}>
                        {messageList.some(message => emp?.name === message.sender || emp?.name === message.recipient) ?
                            messageList.map((message, index) => {
                                // 날짜가 다른지 확인
                                const checkDate = index === 0 || !isSameDay(new Date(messageList[index - 1].sendTime), message.sendTime);

                                // 날짜가 다른 경우 Date 포맷 변환
                                const formattedDate = format(message.sendTime, 'yyyy년 M월 d일 EEEE', { locale: ko });

                                // sendTime을 HH:mm 포맷 변환
                                const formattedTime = format(new Date(message.sendTime), 'HH:mm');

                                // 이전 메시지와 비교 (프로필 정보)
                                // checkMessage가 true면 프로필 띄우기, false면 프로필 띄우지 않기(메시지만 보임)
                                const checkMessage = index === 0 || messageList[index - 1].sender !== message.sender;

                                return (
                                    <React.Fragment key={index}>
                                        {checkDate && (
                                            <div className={styles.dateBox}>
                                                {formattedDate}
                                            </div>
                                        )}
                                        {(emp?.name === message.sender || emp?.name === message.recipient) && (
                                            <div className={`${emp?.name === message.recipient ? styles.sendMessageBox : styles.receiveMessageBox}`}>
                                                <div className={styles.chatting_messageBox}>
                                                    {checkMessage && emp?.name === message.sender && (
                                                        <div className={styles.sender_profile}>
                                                            <img src={emp.profile} alt="Profile" className={styles.image} />
                                                            <p>{message.sender}</p>
                                                        </div>
                                                    )}
                                                    <div className={styles.messageBox}>
                                                        <div className={styles.message_content}>
                                                            {message.content}
                                                        </div>
                                                        <div className={styles.message_state_and_sendTime}>
                                                            <div className={styles.message_sendTime}>
                                                                {formattedTime}
                                                            </div>
                                                            <div className={styles.message_state}>
                                                                {message.state === '읽음' ? '' : `${message.count}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })
                            : <div>메시지를 입력하여 대화를 시작해보세요.</div>
                        }
                    </div>
                    <div className={`${styles.input_emojiPickerDiv} ${styles.epr_c90x4z} ${styles['epr_-6npj90']}`} style={{ display: isEmojiToggle ? 'block' : 'none' }} ref={emojiRef}>
                        <EmojiPicker className={styles.input_emojiPicker_css} onEmojiClick={emojiClick} />
                    </div>
                    <footer>
                        <div className={styles.input_message}>
                            <div className={styles.input_message_emoji}>
                                <Button ref={emojiButtonRef} className={styles.input_message_emojiButton} onClick={emojiToggle}><i class="material-icons">face</i></Button>
                            </div>
                            <input type='text' value={message} onChange={(e) => { setMessage(e.target.value) }} placeholder='메시지를 입력하세요'></input>
                            <div className={styles.input_message_button}>
                                <Button className={styles.input_message_attachButton}><i class="material-icons">attach_file</i></Button>
                                <Button className={styles.input_message_sendButton} onClick={handlerSendMessage} disabled={readyState !== 1}><i class="material-icons">send</i></Button>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default Chatting;