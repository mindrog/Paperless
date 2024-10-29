import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import styles from '../../styles/company/company_chatting.module.css'
import { Button } from 'react-bootstrap';
import EmojiPicker from 'emoji-picker-react';
import { format, isSameDay, isValid, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import api from '../layout/api';
import { useSelector } from 'react-redux';

// .env 파일
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

function Chatting() {
    // Redux에서 사용자 정보 가져오기
    const userData = useSelector((state) => state.user.data);

    const empNo = userData.emp_no;

    // 상태 변수로 사용자 정보를 초기화
    const [user, setUser] = useState(null);

    // 사용자 정보 저장 로직
    useEffect(() => {
        // empList에서 empNo와 일치하는 직원 찾기
        const foundUser = empList.find(emp => emp.emp_no === empNo);
        console.log("foundUser:", foundUser);
        if (foundUser) setUser(foundUser);
    }, [empNo]);

    // ** 더미 데이터 ** //
    // 직원
    const empList = [
        { emp_no: 3, emp_name: '배수지', emp_email: 'suzy@digitalsolution.com', emp_phone: '010-1234-5678', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 100, emp_posi_no: 4 },
        { emp_no: 4, emp_name: '강동원', emp_email: 'dongwon@digitalsolution.com', emp_phone: '010-8765-4321', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 100, emp_posi_no: 6 },
        { emp_no: 5, emp_name: '김태리', emp_email: 'taeri@digitalsolution.com', emp_phone: '010-2345-6789', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 500, emp_posi_no: 3 },
        { emp_no: 6, emp_name: '이준호', emp_email: 'junho@digitalsolution.com', emp_phone: '010-3456-7890', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 110, emp_posi_no: 4 },
        { emp_no: 7, emp_name: '박서준', emp_email: 'seojun@digitalsolution.com', emp_phone: '010-5555-1234', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 200, emp_posi_no: 3 },
        { emp_no: 8, emp_name: '이서진', emp_email: 'seojin@digitalsolution.com', emp_phone: '010-1010-2020', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 200, emp_posi_no: 4 },
        { emp_no: 9, emp_name: '유아인', emp_email: 'yooain@digitalsolution.com', emp_phone: '010-3030-4040', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 210, emp_posi_no: 5 },
        { emp_no: 10, emp_name: '공효진', emp_email: 'gonghj@digitalsolution.com', emp_phone: '010-5050-6060', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 100, emp_posi_no: 2 },
    ];

    // 회사
    const compList = [
        { comp_no: 1, comp_name: 'Digitalsolution' },
        { comp_no: 2, comp_name: 'Nextware' },
    ];

    // 부서
    const deptList = [
        { dept_no: 100, dept_name: 'IT부서', dept_team_name: '개발팀' },
        { dept_no: 110, dept_name: 'IT부서', dept_team_name: '인프라팀' },
        { dept_no: 120, dept_name: 'IT부서', dept_team_name: '보안팀' },
        { dept_no: 200, dept_name: '마케팅부서', dept_team_name: '디지털마케팅팀' },
        { dept_no: 210, dept_name: '마케팅부서', dept_team_name: '브랜드팀' },
        { dept_no: 220, dept_name: '마케팅부서', dept_team_name: '시장조사팀' },
        { dept_no: 300, dept_name: '영업부서', dept_team_name: '국내영업팀' },
        { dept_no: 310, dept_name: '영업부서', dept_team_name: '해외영업팀' },
        { dept_no: 320, dept_name: '영업부서', dept_team_name: '영업기획팀' },
        { dept_no: 400, dept_name: 'HR부서', dept_team_name: '채용팀' },
        { dept_no: 410, dept_name: 'HR부서', dept_team_name: '인사관리팀' },
        { dept_no: 420, dept_name: 'HR부서', dept_team_name: '교육팀' },
        { dept_no: 500, dept_name: '구매부서', dept_team_name: '구매팀' },
        { dept_no: 510, dept_name: '구매부서', dept_team_name: '자재관리팀' },
    ];

    // 직급
    const posiList = [
        { posi_no: 1, posi_name: '사원' },
        { posi_no: 2, posi_name: '주임' },
        { posi_no: 3, posi_name: '대리' },
        { posi_no: 4, posi_name: '과장' },
        { posi_no: 5, posi_name: '차장' },
        { posi_no: 6, posi_name: '부장' },
        { posi_no: 7, posi_name: '이사' },
        { posi_no: 8, posi_name: '상무' },
        { posi_no: 9, posi_name: '전무' },
        { posi_no: 10, posi_name: '부사장' },
        { posi_no: 11, posi_name: '사장' },
    ];

    // 직원 목록을 각 회사 정보와 함께 저장할 배열
    const processedEmpList = empList.map(emp => {
        const company = compList.find(comp => comp.comp_no === emp.emp_comp_no); // emp_comp_no와 일치하는 회사 정보 찾기
        const department = deptList.find(dept => dept.dept_no === emp.emp_dept_no); // 해당 부서 정보 찾기
        const position = posiList.find(posi => posi.posi_no === emp.emp_posi_no); // 해당 직급 정보 찾기

        return {
            ...emp,
            emp_comp_name: company ? company.comp_name : 'Unknown', // 회사 이름 동적 참조
            emp_dept_name: department ? `${department.dept_name}${department.dept_team_name ? ' - ' + department.dept_team_name : ''}` : 'Unknown', // 부서, 팀 이름 동적 참조
            emp_posi_name: position ? position.posi_name : 'Unknown' // 직급 이름 동적 참조
        };
    });

    // 메시지 목록 상태 변수
    const [messageList, setMessageList] = useState([]);

    // 메시지를 저장하고 출력하는 변수
    const [message, setMessage] = useState('');

    // 로컬 스토리지에 저장된 emp 데이터 저장하는 변수 (더미 이용한 변수)
    // 대화 상대 (로그인한 사람과 채팅할 대상)
    const [emp, setEmp] = useState(null);

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

    // socketUrl과 WebSocket 객체를 상태로 관리
    const [socket, setSocket] = useState(null);

    // // socket
    // const [socketUrl, setSocketUrl] = useState(null);

    // 메시지 입력 상태와 WebSocket 연결 상태에 따라 전송 버튼 활성화
    const isSendButtonDisabled = useMemo(() => {
        return message.trim() === '';
    }, [message]);

    // 보낸 메시지 관리
    // sendMessage: WebSocket 서버로 메시지를 보내는 함수
    //  클라이언트가 서버에 데이터를 전송할 때 사용
    // lastMessage: 서버에서 마지막으로 수신한 메시지
    //  서버에서 메시지가 올 때마다 업데이트
    // readyState: WebSocket의 연결 상태를 나타내는 함수
    //  총 4가지로 0: 연결 시도 중, 1: 연결, 2: 연결 종료 시도 중, 3: 연결 종료
    const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(WEBSOCKET_URL, {
        shouldReconnect: () => true,
        onOpen: () => console.log('WebSocket 연결 성공!'),
        onClose: () => console.log('WebSocket 연결 해제됨'),
        onError: (event) => console.error('WebSocket 에러:', event),
    }); // WebSocket이 수동으로 연결되도록 설정

    // 페이지 접근 시 WebSocket 연결
    useEffect(() => {
        getWebSocket();
    }, [getWebSocket]);

    // WebSocket 연결 상태 메시지 매핑
    const connectionStatus = useMemo(() => ({
        0: '연결 시도 중..',
        1: '연결됨',
        2: '연결 종료 시도 중..',
        3: '연결 종료'
    }), []);

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
        return isValid(date) ? date : null;
    };

    // 메시지 전송 버튼 메서드
    const handlerSendMessage = async () => {
        if (!message.trim() || !emp || !Array.isArray(emp.participants)) {
            console.warn('메시지 전송 조건이 충족되지 않았습니다.');
            return;
        }

        const chatRoomNo = emp.chat_room_no;
        const totalMessages = messageList.length;
        const currentTime = new Date().toISOString();
        const chatRecipientNos = emp.participants.filter(p => p.emp_no !== empNo).map(p => p.emp_no);

        if (chatRecipientNos.length === 0) {
            console.warn('채팅방 참여자가 없습니다.');
            return;
        }

        const newMessage = {
            chat_room_no: chatRoomNo,
            chat_no: totalMessages + 1,
            chat_sender: empNo,
            chat_recipient: chatRecipientNos,
            chat_content: message,
            chat_count: chatRecipientNos.length,
            chat_type: 'text',
            chat_date: currentTime,
        };

        try {
            // WebSocket을 통해 메시지 전송
            if (readyState === ReadyState.OPEN) {
                sendMessage(JSON.stringify(newMessage));
                console.log('메시지 전송 중:', newMessage);

                // REST API를 통해 메시지 저장
                await api.sendMessage(newMessage);

                // 메시지 리스트 업데이트
                setMessageList((prev) => [...prev, newMessage]);
                setMessage('');
            } else {
                console.warn('WebSocket이 아직 연결되지 않았습니다.');
            }
        } catch (error) {
            console.error('메시지 전송 중 오류 발생:', error);
        }
    };

    // 메시지 업데이트 시 스크롤 맨 아래로 이동
    useEffect(() => {
        if (mainContainerRef.current) {
            mainContainerRef.current.scrollTop = mainContainerRef.current.scrollHeight;
        }
    }, [messageList]);

    // WebSocket에서 마지막 메시지 수신 시 처리
    useEffect(() => {
        if (lastMessage !== null) {
            console.log('서버로부터 받은 메시지:', lastMessage);
        }
    }, [lastMessage]);

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

                // 메시지 리스트 설정 시, 정보를 processedEmpList에서 찾아 추가
                const processedMessages = chatData.messages.map((message) => {
                    // 전송자 찾기
                    const senderInfo = processedEmpList.find(emp => emp.emp_no === message.chat_sender);
                    return {
                        ...message,
                        senderName: senderInfo ? senderInfo.emp_name : 'Unknown',
                        senderProfile: senderInfo ? senderInfo.emp_profile : 'https://via.placeholder.com/60'
                    };
                });

                // URL에서 가져온 메시지 리스트를 상태에 설정
                // messages가 있는지 확인 후 설정
                if (Array.isArray(chatData.messages)) {
                    console.log("Updating messageList with:", processedMessages);
                    setMessageList(processedMessages);
                } else {
                    console.warn('Invalid messageList:', processedMessages);
                }

                // participantNos 배열의 첫 번째 참가자를 기반으로 emp 정보 설정
                const empFromData = processedEmpList.find(emp => emp.emp_no === chatData.participantNos[0]);
                console.log('chatData.participantNos[0]:', chatData.participantNos[0]);
                console.log('empFromData:', empFromData);

                // participants 배열 확인 및 초기화
                const participants = Array.isArray(chatData.participants) ? chatData.participants : Array.isArray(chatData.participantNos) ? chatData.participantNos : [];

                // emp 객체에 participants 정보 추가
                if (empFromData) {
                    setEmp({ ...empFromData, participants: participants.map(no => ({ emp_no: no })), chat_room_no: chatData.room_no });
                } else {
                    console.warn("empFromData가 설정되지 않았습니다.");
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
                                // 유효하지 않은 날짜는 건너뜀
                                if (!messageDate) return null;

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

                                        <div className={`${user.emp_no === message.chat_sender ? styles.sendMessageBox : styles.receiveMessageBox}`}>
                                            <div className={styles.chatting_messageBox}>
                                                {checkMessage && user.emp_no !== message.chat_sender && (
                                                    <div className={styles.sender_profile}>
                                                        <img src={message.senderProfile} alt="Profile" className={styles.image} />
                                                        <p>{message.senderName}</p>
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
                                                            {message.chat_count ? message.chat_count : ''}
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
                                <Button className={styles.input_message_sendButton} onClick={handlerSendMessage} disabled={isSendButtonDisabled}><i class="material-icons">send</i></Button>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default Chatting;