import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useParams, useSearchParams } from 'react-router-dom';
import styles from '../../styles/company/company_chatting.module.css'
import { Button } from 'react-bootstrap';
import EmojiPicker from 'emoji-picker-react';
import { format, isSameDay, isValid, parse } from 'date-fns';
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
    // ** 더미 데이터를 이용하여 로그인 객체 하드코딩 ** //
    // const empNo = 1; // 현재 로그인한 사용자

    const [user, setUser] = useState(null); // 상태 변수로 사용자 정보를 초기화

    const [searchParams] = useSearchParams();
    const empNo = Number(searchParams.get('emp_no'));

    // 사용자 정보 저장 로직
    useEffect(() => {
        // empList에서 empNo와 일치하는 직원 찾기
        const foundUser = empList.find(emp => emp.emp_no === empNo);
        if (foundUser) setUser(foundUser);
    }, [empNo]);

    // ** 더미 데이터 ** //
    // 직원
    const empList = [
        { emp_no: 1, emp_name: '배수지', emp_email: 'suji0123@naver.com', emp_phone: '010-9876-5432', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 0, emp_team_name: '', emp_posi_no: 6 },
        { emp_no: 2, emp_name: '장원영', emp_email: 'jang0101@naver.com', emp_phone: '010-1234-1234', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 0, emp_posi_no: 6 },
        { emp_no: 3, emp_name: '박보영', emp_email: 'boyoung0202@naver.com', emp_phone: '010-2345-2345', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 0, emp_posi_no: 7 },
        { emp_no: 4, emp_name: '박보검', emp_email: 'gumgum0303@gmail.com', emp_phone: '010-3456-3456', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 0, emp_posi_no: 5 },
        { emp_no: 5, emp_name: '전지현', emp_email: 'jjh0404@naver.com', emp_phone: '010-4567-4567', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 1, emp_posi_no: 4 },
        { emp_no: 6, emp_name: '이도현', emp_email: 'dodo0505@gmail.com', emp_phone: '010-5678-5678', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 0, emp_posi_no: 4 },
        { emp_no: 7, emp_name: '김태리', emp_email: 'kimlee0606@gmail.com', emp_phone: '010-6789-6789', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 0, emp_posi_no: 5 },
        { emp_no: 8, emp_name: '강동원', emp_email: 'dongwon0707@naver.com', emp_phone: '010-7890-7890', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 0, emp_posi_no: 3 },
    ];

    // 회사
    const compList = [
        { comp_no: 0, comp_name: 'IT 대표 업체' },
        { comp_no: 1, comp_name: 'Paperless' },
    ];

    // 부서
    const deptList = [
        { dept_no: 0, dept_name: 'it 개발부', dept_team_name: '콘텐츠 기획팀' },
        { dept_no: 1, dept_name: 'it 개발부', dept_team_name: 'SW 개발팀' },
    ];

    // 직급
    const posiList = [
        { posi_no: 0, posi_name: '대표' },
        { posi_no: 1, posi_name: '사장' },
        { posi_no: 2, posi_name: '부장' },
        { posi_no: 3, posi_name: '차장' },
        { posi_no: 4, posi_name: '과장' },
        { posi_no: 5, posi_name: '팀장' },
        { posi_no: 6, posi_name: '대리' },
        { posi_no: 7, posi_name: '사원' },
    ];

    // 직원 목록을 각 회사 정보와 함께 저장할 배열
    const processedEmpList = empList.map(emp => {
        const company = compList.find(comp => comp.comp_no === emp.emp_comp_no); // emp_comp_no와 일치하는 회사 정보 찾기
        const department = deptList.find(dept => dept.dept_no === emp.emp_dept_no); // 해당 부서 정보 찾기
        const team = deptList.find(dept => dept.dept_no === emp.emp_dept_no);
        const position = posiList.find(posi => posi.posi_no === emp.emp_posi_no); // 해당 직급 정보 찾기

        return {
            ...emp,
            emp_comp_name: company ? company.comp_name : 'Unknown', // 회사 이름 동적 참조
            emp_dept_name: department ? department.dept_name : 'Unknown', // 부서 이름 동적 참조
            emp_team_name: team ? team.dept_team_name : 'Unknown', // 팀 이름 동적 참조
            emp_posi_name: position ? position.posi_name : 'Unknown' // 직급 이름 동적 참조
        };
    });

    // 메시지 목록 상태 변수
    const [messageList, setMessageList] = useState([]);

    // WEBSOCKET_URL 저장 변수
    const [socketUrl] = useState(WEBSOCKET_URL);

    // 메시지를 저장하고 출력하는 변수
    const [message, setMessage] = useState('');

    // // 고유한 사용자 아이디를 생성
    // const [userId] = useState(uuidv4());

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

    // WebSocket 연결 상태 메시지 매핑
    const connectionStatus = useMemo(() => ({
        0: '연결 시도 중..',
        1: '연결됨',
        2: '연결 종료 시도 중..',
        3: '연결 종료'
    }), [readyState]);

    // 돋보기 토글 상태 변환 메서드
    const selectToggle = () => {
        setShowSelectInput(!showSelectInput);
    };

    // 이모지 토글 상태 변환 메서드
    const emojiToggle = () => {
        setIsEmojiToggle(prev => !prev);
    };

    // 이모지 선택 시 메서드
    const emojiClick = (selectEmoji) => {
        setMessage(preMessage => preMessage + selectEmoji.emoji);
    };

    // 날짜 파싱 메서드
    const parseChatDate = (dateString) => {
        // chat_date 형식이 "YYYY-MM-DD HH:mm"이므로 이에 맞는 파싱을 수행
        const date = parse(dateString, 'yyyy-MM-dd HH:mm', new Date());
        if (!isValid(date)) {
            console.warn("Invalid date format detected:", dateString);
            return null;
        }
        return date;
    };

    // 메시지 전송 버튼 메서드
    const handlerSendMessage = async () => {
        if (message.trim() && emp && emp.participants) {
            try {
                // REST API를 통해 메시지 전송
                await api.sendMessage({
                    chat_room_no: emp.chat_room_no,
                    chat_sender: empNo,
                    chat_recipient: emp.participants,
                    chat_content: message,
                    chat_type: 'text',
                });

                // WebSocket을 통해 메시지를 보내기도 함
                sendMessage(JSON.stringify({ action: 'sendMessage', message, empNo }));
                setMessage(''); // 메시지 입력란 초기화
            } catch (error) {
                console.error('메시지 전송 중 오류 발생:', error);
            }
        } else {
            console.warn('메시지 또는 emp 정보가 올바르지 않습니다.');
        }
    };

    // 메시지 업데이트 시 스크롤 맨 아래로 이동
    useEffect(() => {
        if (mainContainerRef.current) {
            mainContainerRef.current.scrollTop = mainContainerRef.current.scrollHeight;
        }
    }, [messageList]);

    // readyState가 변경될 때마다 함수를 실행
    useEffect(() => {
        console.log('WEBSOCKET_URL:', WEBSOCKET_URL);

        // 연결 되었을 때
        if (readyState === 1) {
            console.log('연결 성공!');
        }
    }, [readyState]);

    // // chat.js에서 emp.name 가져오기
    // useEffect(() => {
    //     try {
    //         // 로컬 스토리지에 저장된 key: `chatting-emp-${emp.name}`에서 emp.name을 name으로 바꿔서 불러오기
    //         // → emp를 불러와야하므로 url에서 가져온 name으로 emp 찾기
    //         const storageEmp = localStorage.getItem(`chatting-emp-${name}`);

    //         // 저장된 emp가 있다면 저장된 문자열을 원래의 객체 형식으로 저장 (여기선 emp)
    //         if (storageEmp) setEmp(JSON.parse(storageEmp));
    //     } catch (error) {
    //         console.error("Error fetching employee data from localStorage: ", error);
    //     }
    // }, [name]);

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

    // URL에서 전달된 데이터를 파싱하여 상태로 설정
    useEffect(() => {
        try {
            // URL에서 쿼리 파라미터 가져오기
            const queryParams = new URLSearchParams(window.location.search);
            // 'data'라는 키로 인코딩된 데이터 가져오기
            const encodedData = queryParams.get('data');

            // 인코딩된 데이터가 있는 경우
            if (encodedData) {
                // 인코딩된 데이터를 디코딩하고 JSON으로 파싱
                const chatData = JSON.parse(decodeURIComponent(encodedData));

                console.log('Decoded chatData:', chatData);
                console.log('chatData.messages:', chatData.messages);

                // URL에서 가져온 메시지 리스트를 상태에 설정
                // messages가 있는지 확인 후 설정
                if (Array.isArray(chatData.messages)) {
                    console.log("Updating messageList with:", chatData.messages);
                    setMessageList(chatData.messages);
                } else {
                    console.warn('Invalid messageList:', chatData.messages);
                }

                // participantNos 배열의 첫 번째 참가자를 기반으로 emp 정보 설정
                const empFromData = processedEmpList.find(emp => emp.emp_no === chatData.participantNos[0]);
                console.log('chatData.participantNos[0]:', chatData.participantNos[0]);
                console.log('empFromData:', empFromData);
                console.log('type chatData.participantNos[0]:', typeof (chatData.participantNos[0]));
                console.log('type empFromData:', typeof (empFromData));

                if (empFromData) {
                    console.log("Updating emp with:", empFromData);
                    setEmp(empFromData);
                } else {
                    console.warn("유효한 emp 정보를 찾을 수 없습니다.");
                }
            } else {
                console.error("URL에 인코딩된 데이터가 없습니다.");
            }
        } catch (error) {
            console.error("URL에서 채팅 데이터를 파싱하는 중 오류 발생:", error);
        }
    }, []);

    return (
        <>
            {/* <Helmet>
                <link rel="icon" type="image/png" href="/img/final_favicon.png" sizes="16x16" />
                <title>{emp ? `${emp.participants}님과의 채팅` : 'Loading...'}</title>
            </Helmet>

            <div>
                <p>emp_no: {emp?.emp_no}</p>
                <p>emp_name: {emp ? `${emp.emp_name}님과의 채팅` : 'Loading...'}</p>
                <p>emp_email: {emp?.emp_email}</p>
                <p>emp_phone: {emp?.emp_phone}</p>
                <p>emp_profile: <img src={emp?.emp_profile} alt="Profile" style={{ width: '50px', height: '50px' }} /></p>
                <p>emp_comp_name: {emp?.emp_comp_name}</p>
                <p>emp_dept_name: {emp?.emp_dept_name} {emp?.emp_team_name}</p>
                <p>emp_posi_name: {emp?.emp_posi_name}</p>

                <h2>Message List:</h2>
                {messageList.length > 0 ? (
                    messageList.map((message, index) => (
                        <div key={index}>
                            <hr></hr>
                            <p>chat_sender: {message.chat_sender}</p>
                            <p>chat_recipient: {message.chat_recipient}</p>
                            <p>chat_date: {message.chat_date}</p>
                            <p>chat_content: {message.chat_content}</p>
                            <p>chat_count: {message.chat_count}</p>
                            <p>chat_room_no: {message.chat_room_no}</p>
                            <p>chat_no: {message.chat_no}</p>
                            <p>chat_type: {message.chat_type}</p>
                            <hr></hr>
                        </div>
                    ))
                ) : (
                    <p>Message list is empty</p>
                )}
            </div> */}
            <Helmet>
                <link rel="icon" type="image/png" href="/img/final_favicon.png" sizes="16x16" />
                <title>{emp ? `${emp.emp_name}님과의 채팅` : 'Loading...'}</title>
            </Helmet>
            <div className="container-xl" style={{ padding: '0' }}>
                <div className={styles.chatting_container}>
                    <header>{emp ? (
                        <div className={styles.header_profile}>
                            <div className={styles.header_profile_img}>
                                <img src={emp?.emp_profile || 'https://via.placeholder.com/60'} alt="Profile" className={styles.image} />
                            </div>
                            <div className={styles.header_profile_container}>
                                <div className={styles.header_profile_info}>
                                    <div className={styles.header_profile_dept}>
                                        <p>{emp?.emp_dept_name}</p>
                                    </div>
                                    <div className={styles.header_profile_name}>
                                        <p>{emp?.emp_name} {emp?.emp_posi_name}</p>
                                    </div>
                                </div>
                                <div className={styles.select_chatting}>
                                    {/*<div>
                                        <p>연결 확인: {connectionStatus}</p>
                                        <p>수신 확인: {lastMessage ? lastMessage.data : '메시지x '}</p>
                                        <p>사용자 ID: {empNo}</p>
                                    </div>*/}
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
                        {messageList.length > 0 ? (
                            messageList.map((message, index) => {
                                // 날짜 파싱을 개선한 parseChatDate 함수 사용
                                const messageDate = parseChatDate(message.chat_date);

                                if (!messageDate) return null; // 유효하지 않은 날짜는 건너뜀

                                // 날짜가 다른지 확인
                                const checkDate = index === 0 || !isSameDay(new Date(messageList[index - 1].chat_date), messageDate);

                                // 날짜가 다른 경우 Date 포맷 변환
                                const formattedDate = format(messageDate, 'yyyy년 M월 d일 EEEE', { locale: ko });

                                // sendTime을 HH:mm 포맷 변환
                                const formattedTime = format(new Date(messageDate), 'HH:mm');

                                // 이전 메시지와 비교 (프로필 정보)
                                // checkMessage가 true면 프로필 띄우기, false면 프로필 띄우지 않기(메시지만 보임)
                                const checkMessage = index === 0 || messageList[index - 1].chat_sender !== message.chat_sender;

                                return (
                                    <React.Fragment key={index}>
                                        {checkDate && (
                                            <div className={styles.dateBox}>
                                                {formattedDate}
                                            </div>
                                        )}

                                        <div className={`${emp?.emp_no !== message.chat_recipient ? styles.sendMessageBox : styles.receiveMessageBox}`}>
                                            <div className={styles.chatting_messageBox}>
                                                {checkMessage && emp?.emp_no === message.chat_recipient.S && (
                                                    <div className={styles.sender_profile}>
                                                        <img src={emp?.emp_profile || 'https://via.placeholder.com/60'} alt="Profile" className={styles.image} />
                                                        <p>{message.chat_sender}</p>
                                                    </div>
                                                )}
                                                <div className={styles.messageBox}>
                                                    <div className={styles.message_content}>
                                                        {message.chat_content}
                                                    </div>
                                                    <div className={styles.message_state_and_sendTime}>
                                                        <div className={styles.message_sendTime}>
                                                            {formattedTime}
                                                        </div>
                                                        <div className={styles.message_state}>
                                                            {message.chat_count}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            <div>메시지를 입력하여 대화를 시작해보세요.</div>
                        )}
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