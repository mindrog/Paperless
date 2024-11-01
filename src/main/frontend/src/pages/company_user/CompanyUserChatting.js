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
import DOMPurify from 'dompurify';

// .env 파일
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

function Chatting() {
    // Redux에서 사용자 정보 가져오기
    const userData = useSelector((state) => state.user.data);

    // 상태 변수로 사용자 정보를 초기화
    const [user, setUser] = useState(null);

    // 메시지 목록 상태 변수
    const [messageList, setMessageList] = useState([]);

    // 메시지를 저장하고 출력하는 변수
    const [message, setMessage] = useState('');

    // 로컬 스토리지에 저장된 emp 데이터 저장하는 변수 (더미 이용한 변수)
    // 대화 상대 (로그인한 사람과 채팅할 대상)
    const [emp, setEmp] = useState(null);

    // emp가 준비된 후에 WebSocket URL을 설정
    const [socketUrl, setSocketUrl] = useState(null);

    // 돋보기 토글 상태
    const [showSelectInput, setShowSelectInput] = useState(false);

    // 이모지 토글 상태
    const [isEmojiToggle, setIsEmojiToggle] = useState(false);

    // emojiRef 참조 변수
    const emojiRef = useRef(null);

    // emojiButtonRef 참조 변수
    const emojiButtonRef = useRef(null);

    // mainContainerRef 참조 변수
    const mainContainerRef = useRef(null);

    // 검색어 상태 변수
    const [searchTerm, setSearchTerm] = useState('');

    // 검색 결과 인덱스 저장
    const [searchResults, setSearchResults] = useState([]);

    // 현재 검색 결과의 인덱스
    const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

    // 검색 초기화 버튼
    const clearSearchTerm = () => {
        setSearchTerm('');
        setSearchResults([]);
        setCurrentSearchIndex(0);
    };

    // 검색어 입력 핸들러
    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // 검색 실행 함수
    const handleSearch = () => {
        // 검색어가 비어 있으면 아무것도 하지 않음
        if (!searchTerm.trim()) return;

        // 기존 검색어와 동일한 경우, 인덱스만 이동
        if (searchResults.length > 0 && searchResults.some(result => result.chat_content.includes(searchTerm))) {
            // 기존 검색어 결과에서 인덱스 이동
            const nextIndex = (currentSearchIndex + 1) % searchResults.length;
            setCurrentSearchIndex(nextIndex);
            scrollToMessage(searchResults[nextIndex].index);
        } else {
            // 새로운 검색어 입력 시 새로운 검색 수행
            const results = messageList
                .map((message, index) => ({ ...message, index }))
                .filter(message => message.chat_content.includes(searchTerm));

            if (results.length > 0) {
                setSearchResults(results);
                setCurrentSearchIndex(0);
                scrollToMessage(results[0].index); // 첫 번째 결과로 이동
            } else {
                setSearchResults([]);
                setCurrentSearchIndex(0);
            }
        }
    };

    // 다음 검색 결과로 이동
    const handleNextSearchResult = () => {
        if (searchResults.length === 0) return;
        const nextIndex = (currentSearchIndex + 1) % searchResults.length;
        setCurrentSearchIndex(nextIndex);
        scrollToMessage(searchResults[nextIndex].index);
    };

    // 이전 검색 결과로 이동
    const handlePreviousSearchResult = () => {
        if (searchResults.length === 0) return;
        const prevIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
        setCurrentSearchIndex(prevIndex);
        scrollToMessage(searchResults[prevIndex].index);
    };

    // 특정 메시지로 스크롤 이동
    const scrollToMessage = (messageIndex) => {
        if (mainContainerRef.current) {
            // 메시지 컨테이너에서 해당 인덱스의 메시지로 이동
            const targetMessage = mainContainerRef.current.querySelectorAll(`.${styles.chatting_messageBox}`)[messageIndex];
            if (targetMessage) {
                targetMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

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
    // WebSocket 연결 설정
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
        shouldReconnect: (closeEvent) => {
            // 연결 해제 이벤트를 처리하고, 특정 조건에서만 재연결 허용
            if (closeEvent.code !== 1000) { // 정상적인 종료 코드(1000)가 아닐 때만 재연결 시도
                console.warn('WebSocket 비정상 종료, 재연결 시도...');
                return true;
            }
            console.log('WebSocket 연결이 정상적으로 종료되었습니다.');
            return false;
        },
        onOpen: () => {
            console.log('WebSocket 연결 성공!');
        },
        onClose: (event) => {
            console.warn('WebSocket 연결 해제됨:', event.code, event.reason);
        },
        onError: (event) => {
            console.error('WebSocket 에러:', event);
        },
    }, socketUrl !== null); // 마지막 인자로 socketUrl이 null이 아닌 경우에만 WebSocket을 시도

    // emp 데이터가 준비되었을 때 WebSocket URL 설정
    useEffect(() => {
        console.log('emp:', emp);
        if (emp && emp.chat_room_no) {
            const url = `${WEBSOCKET_URL}?chat_room_no=${emp.chat_room_no}`;
            if (url !== socketUrl) {
                console.log('emp.chat_room_no:', emp.chat_room_no);
                console.log('WebSocket URL 설정:', url);
                setSocketUrl(url);
            }
        } else {
            console.warn('emp 객체가 없거나 chat_room_no가 설정되지 않았습니다.');
        }
    }, [emp, socketUrl]);

    // 돋보기 토글 상태 변환 메서드
    const selectToggle = () => {
        console.log('showSelectInput 상태:', showSelectInput);
        // 검색창이 열려있고, 검색어가 있을 때는 검색을 수행
        if (showSelectInput && searchTerm.trim()) {
            handleSearch();
        } else {
            // 검색창을 토글하고, 검색창이 닫힐 때 검색어 초기화
            setShowSelectInput((prev) => {
                if (!prev) {
                    // 검색창이 닫힐 때 초기화
                    setSearchTerm('');
                    setSearchResults([]);
                    setCurrentSearchIndex(0);
                }
                return !prev;
            });
        }
    };

    // 특수문자를 이스케이프 처리하는 함수
    const escapeRegExp = (string) => {
        // 정규식의 특수문자를 이스케이프 처리
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 메시지 컴포넌트 내에서 키워드 강조 처리 로직 추가
    const highlightKeyword = (text, keyword) => {
        if (!keyword.trim()) return text; // 키워드가 없을 경우 원본 텍스트 반환

        // 정규 표현식으로 키워드를 찾고 <strong> 태그로 감싸기
        const escapedKeyword = escapeRegExp(keyword); // 키워드를 이스케이프 처리
        const regex = new RegExp(`(${escapedKeyword})`, 'gi'); // 키워드 대소문자 구분 없이 찾기
        return text.replace(regex, "<strong>$1</strong>");
    };

    // handleKeyDown 함수 추가: ESC 키 이벤트를 처리
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            clearSearchTerm(); // 검색 키워드 및 검색 결과 초기화
            setShowSelectInput(false); // 검색 창 닫기
        }
    };

    // 컴포넌트 마운트 시 ESC 키 이벤트 리스너 추가
    useEffect(() => {
        // 키다운 이벤트 리스너 추가
        document.addEventListener('keydown', handleKeyDown);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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
        console.log('message:', message);
        console.log('emp:', emp);
        if (!message.trim() || !emp) {
            console.warn('메시지 전송 조건이 충족되지 않았습니다.');
            return;
        }
        const chatRoomNo = emp.chat_room_no;
        // messageList에서 가장 큰 chat_no를 찾고, 없으면 0을 기본값으로 설정
        const lastChatNo = messageList.length > 0 ? Math.max(...messageList.map(msg => msg.chat_no)) : -1; // 메시지가 없다면 -1을 기본값으로
        const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm');
        console.log('currentTime:', currentTime);
        const chatRecipientNo = emp.emp_no;
        const chatRecipientCount = Array.isArray(emp) ? emp.length : 1;
        console.log('chatRecipientCount:', chatRecipientCount);
        if (Array.isArray(emp)) {
            console.warn('그룹 채팅입니다.');
            return;
        }
        const newMessage = {
            action: 'sendMessage',
            chat_room_no: chatRoomNo,
            chat_no: lastChatNo + 1,
            chat_sender: user.emp_no,
            chat_recipient: chatRecipientNo,
            chat_content: message,
            chat_count: chatRecipientCount,
            chat_type: 'text',
            chat_date: currentTime
        };
        console.log('Sending newMessage:', newMessage);
        try {
            // WebSocket을 통해 메시지 전송
            if (readyState === ReadyState.OPEN) {
                // WebSocket을 통해 실시간 전송
                sendMessage(JSON.stringify(newMessage));
                console.log('메시지 전송 중:', newMessage);

                // REST API를 통해 서버에 메시지 저장
                await api.sendMessage(newMessage);
                console.log('메시지 서버 저장 완료:', newMessage);

                // 메시지 리스트 업데이트
                setMessageList((prev) => [...prev, newMessage]);
                setMessage('');
            } else {
                console.warn('WebSocket 연결이 열려 있지 않음:', readyState);
            }
        } catch (error) {
            console.error('메시지 전송 중 오류 발생:', error);
        }
    };

    // 메시지 입력 시 Enter 키 이벤트 처리
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !isSendButtonDisabled) {
            handlerSendMessage();
        }
    }

    // 메시지 업데이트 시 스크롤 맨 아래로 이동
    useEffect(() => {
        if (mainContainerRef.current) {
            mainContainerRef.current.scrollTop = mainContainerRef.current.scrollHeight;
        }
    }, [messageList]);

    // WebSocket에서 마지막 메시지 수신 시 처리
    useEffect(() => {
        if (lastMessage !== null) {
            try {
                console.log('lastMessage:', lastMessage);
                // 수신된 메시지를 파싱
                const receivedMessage = JSON.parse(lastMessage.data);
                console.log('Received message:', receivedMessage);
                console.log('messageList:', messageList);
                console.log('receivedMessage.chat_sender:', receivedMessage.chat_sender);
                console.log('receivedMessage.chat_date:', receivedMessage.chat_date);
                
                if (receivedMessage.action !== 'sendMessage') {
                    console.log('receivedMessage의 action 필드가 sendMessage가 아니다!');
                    return;
                }
                
                // 서버로부터 내가 보낸 메시지를 화면에 띄우지 않도록 설정
                if (receivedMessage.chat_sender === user.emp_no) {
                    console.log('내가 보낸 메시지');
                    return;
                }


                if (!receivedMessage.chat_date) {
                    console.warn('Received message is missing chat_date:', receivedMessage);
                } else {
                    setMessageList((prevMessageList) => {
                        // 현재 메시지 리스트에 이미 존재하는지 확인
                        const isMessageExist = prevMessageList.some(
                            (msg) => msg.chat_no === receivedMessage.chat_no && msg.chat_room_no === receivedMessage.chat_room_no
                        );

                        if (!isMessageExist) {
                            let senderName = 'Unknown';
                            let senderProfile = 'https://via.placeholder.com/60';

                            // emp가 배열일 경우와 객체일 경우에 따른 분기 처리
                            if (Array.isArray(emp)) {
                                // emp가 배열일 경우 find를 사용하여 직원 찾기
                                const sender = emp.find((employee) => employee.emp_no === receivedMessage.chat_sender);
                                senderName = sender ? sender.emp_name : senderName;
                                senderProfile = sender ? sender.emp_profile : senderProfile;
                            } else if (typeof emp === 'object' && emp !== null) {
                                // emp가 객체일 경우 key로 접근하여 직원 이름 찾기
                                senderName = emp.emp_no === receivedMessage.chat_sender ? emp.emp_name : senderName;
                                senderProfile = emp.emp_no === receivedMessage.chat_sender ? emp.emp_profile : senderProfile;
                            }
                            console.log('emp:', emp);
                            console.log('typeof emp:', typeof emp);
                            console.log('senderName:', senderName);
                            console.log('senderProfile:', senderProfile);

                            // senderName을 추가하여 메시지 리스트에 저장
                            return [...prevMessageList, { ...receivedMessage, senderName, senderProfile }];
                        }

                        return prevMessageList;
                    });
                }
            } catch (error) {
                console.error('Error parsing received message:', error);
            }
        }
    }, [lastMessage]);

    // 특정 메시지를 클릭해서 읽음 처리하는 함수
    const handleReadMessage = (message) => {
        if (!message.isRead) {
            markMessagesAsRead(message.chat_no);
        };
    }

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

                // 로그인 사용자 정보를 user 상태에 설정
                if (chatData.currentUser) {
                    setUser(chatData.currentUser);
                    console.log('Logged-in user:', chatData.currentUser);
                }

                // 참가자 정보를 추가하여 emp 상태에 설정
                const participants = chatData.participants.map(participant => ({
                    emp_no: participant.emp_no,
                    emp_name: participant.emp_name,
                    emp_profile: participant.emp_profile || 'https://via.placeholder.com/60',
                    emp_dept_name: participant.emp_dept_name || '',
                    dept_team_name: participant.dept_team_name || '',
                    emp_posi_name: participant.emp_posi_name || ''
                }));

                // 첫 번째 참가자 정보로 emp를 설정
                if (participants.length == 1) {
                    setEmp({ ...participants[0], chat_room_no: chatData.room_no });
                } else if (participants.length > 1) {
                    console.log("그룹 채팅입니다.");
                } else {
                    console.warn("참가자가 없습니다.");
                }

                // 메시지 리스트를 chatData에서 직접 설정
                const processedMessages = chatData.messages.map((message) => {
                    const sender = participants.find(participant => participant.emp_no === message.chat_sender);
                    return {
                        ...message,
                        senderName: sender ? sender.emp_name : 'Unknown',
                        senderProfile: sender ? sender.emp_profile : 'https://via.placeholder.com/60',
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
            } else {
                console.error("URL에 인코딩된 데이터가 없습니다.");
            }
        } catch (error) {
            console.error("URL에서 채팅 데이터를 파싱하는 중 오류 발생:", error);
        }
    }, []);

    // mainContainerRef가 특정 위치 도달 시 수신 확인 처리
    useEffect(() => {
        const handleScroll = () => {
            if (mainContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = mainContainerRef.current;
                const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

                // 스크롤이 아래에 도달한 경우, 수신 확인 API 호출
                if (isAtBottom && messageList.length > 0) {
                    const lastMessage = messageList[messageList.length - 1];
                    console.log('markMessagesAsRead 실행!');

                    // 마지막 메시지가 상대방이 보낸 메시지일 경우에만 수신 확인 호출
                    if (lastMessage.chat_sender !== user.emp_no) { // 'user.emp_no'는 현재 사용자의 ID
                        const lastReadChatNo = lastMessage.chat_no;
                        console.log('markMessagesAsRead 실행!');
                        markMessagesAsRead(lastReadChatNo);
                        console.log('markMessagesAsRead 실행 완료!');
                    }
                }
            }
        };

        // WebSocket이 연결된 상태일 때만 scroll 이벤트 리스너 추가
        if (readyState === ReadyState.OPEN) {
            if (mainContainerRef.current) {
                console.log('addEventListener');
                mainContainerRef.current.addEventListener('scroll', handleScroll);
            }
        }

        return () => {
            // 컴포넌트 언마운트 시 또는 WebSocket 상태 변경 시 scroll 이벤트 리스너 제거
            if (mainContainerRef.current) {
                console.log('removeEventListener');
                mainContainerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [messageList, readyState]);

    // 메시지 수신 확인 처리 함수
    const markMessagesAsRead = async (lastReadChatNo) => {
        console.log('markMessagesAsRead 실행 중, lastReadChatNo:', lastReadChatNo);

        const readMessage = {
            action: 'read', // 읽음 처리 작업
            chat_room_no: emp.chat_room_no,
            emp_no: userData.emp_no,
            last_read_chat_no: lastReadChatNo
        };
        console.log('readMessage:', readMessage);

        try {
            // WebSocket 연결 상태 확인 후 전송
            if (readyState === ReadyState.OPEN) {
                sendMessage(JSON.stringify(readMessage));
                console.log('읽음 처리 메시지 전송:', readMessage);
            } else {
                console.warn('WebSocket 연결이 열려 있지 않음 readyState:', readyState);
            }

            // 로컬 상태 업데이트 (서버 업데이트 후 최신 정보 받기)
            setMessageList(prev => prev.map(msg => msg.chat_no <= lastReadChatNo ? { ...msg, is_read: true } : msg));
        } catch (error) {
            console.error('Failed to mark messages as read:', error);
        }
    };

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
                                        <p>{emp?.emp_dept_name} {emp?.dept_team_name}</p>
                                    </div>
                                    <div className={styles.header_profile_name}>
                                        <p>{emp?.emp_name} {emp?.emp_posi_name}</p>
                                    </div>
                                </div>
                                <div className={styles.select_chatting}>
                                    {showSelectInput && (
                                        <div>
                                            <input type='text' className={`${styles.select_input} ${showSelectInput ? styles.select_input_show : styles.select_input_hide}`} value={searchTerm} placeholder='내용을 입력해주세요.' onChange={handleSearchInputChange} onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} autoFocus ></input>
                                            <Button className={styles.clearSearchButton} onClick={clearSearchTerm}><i className="material-icons">clear</i></Button>
                                        </div>
                                    )}
                                    <Button className={styles.select_chattingButton} onClick={selectToggle}><i class="material-icons">search</i></Button>
                                    {searchResults.length > 0 && (
                                        <div className={styles.searchNavigation}>
                                            <Button onClick={handlePreviousSearchResult}><i className="material-icons">expand_less</i></Button>
                                            <Button onClick={handleNextSearchResult}><i className="material-icons">expand_more</i></Button>
                                            <span>{currentSearchIndex + 1} / {searchResults.length}</span>
                                        </div>
                                    )}
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

                                const highlightedContent = highlightKeyword(message.chat_content, searchTerm);
                                const safeHTML = DOMPurify.sanitize(highlightedContent);

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
                                                    <div className={styles.message_content} dangerouslySetInnerHTML={{ __html: safeHTML }}>

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
                            <input type='text' value={message} onChange={(e) => { setMessage(e.target.value) }} onKeyDown={handleKeyPress} placeholder='메시지를 입력하세요'></input>
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