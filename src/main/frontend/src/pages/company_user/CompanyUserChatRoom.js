import React, { useEffect, useState } from 'react';
import api from '../layout/api';
import styles from '../../styles/company/company_chatroom.module.css';
import OrgChart from '../layout/org_chart';
import { Button, Modal } from 'react-bootstrap';
import { format, isToday, isYesterday } from 'date-fns';
import { useSelector } from 'react-redux';
import useFetchUserInfo from '../../componentFetch/useFetchUserInfo';
import useWebSocket from 'react-use-websocket';

// .env 파일
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

function CompanyUserChatRoom() {
    // Redux에서 사용자 정보 가져오기
    const userData = useSelector((state) => state.user.data);

    // Redux에서 사용자 정보 가져온 후 저장할 상태 변수
    const [user, setUser] = useState(null);

    // 토큰 가져오기
    const token = localStorage.getItem('jwt');

    // 조직도 데이터를 가져오기
    const orgChartData = useFetchUserInfo(token);

    // 조직도 검색 키워드 상태 변수
    const [searchTerm, setSearchTerm] = useState('');

    // 검색한 User를 넘기기 위한 상태 변수
    const [selectedUser, setSelectedUser] = useState(null);

    // 채팅방 목록 상태 변수 (초기에는 빈 배열)
    const [chatRoomList, setChatRoomList] = useState([]);

    // 각 채팅방들에 대한 모든 메시지
    const [chatMessages, setChatMessages] = useState({});

    // 가장 최근 메시지 저장하는 객체
    const [recentMessages, setRecentMessages] = useState({});

    // 프로필 모달창 상태 변수
    const [profileModal, setProfileModal] = useState(false);

    // 프로필 데이터에 대한 객체
    const [profileInfo, setProfileInfo] = useState({});

    // 창이 열려있는지 확인하는 변수
    const [openChats, setOpenChats] = useState([]);

    // 새 창이 열릴 때마다 위치 조정해주는 변수
    const [offsetDown, setOffsetDown] = useState(0);
    const [offsetRight, setOffsetRight] = useState(0);

    // 보낸 메시지 관리
    // sendMessage: WebSocket 서버로 메시지를 보내는 함수
    //  클라이언트가 서버에 데이터를 전송할 때 사용
    // lastMessage: 서버에서 마지막으로 수신한 메시지
    //  서버에서 메시지가 올 때마다 업데이트
    // readyState: WebSocket의 연결 상태를 나타내는 함수
    //  총 4가지로 0: 연결 시도 중, 1: 연결, 2: 연결 종료 시도 중, 3: 연결 종료
    // WebSocket 연결 설정
    const { sendMessage, lastMessage, readyState } = useWebSocket(WEBSOCKET_URL, {
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
    });

    useEffect(() => {
        if (lastMessage && lastMessage.data) {
            const receivedMessage = JSON.parse(lastMessage.data);
            const { chat_room_no, chat_content, chat_date, chat_count } = receivedMessage;
            setRecentMessages(prevMessages => ({
                ...prevMessages,
                [chat_room_no]: { chat_content_recent: chat_content, chat_date_recent: chat_date, unread: chat_count }
            }));
        }
    }, [lastMessage]);


    // 모달창 상태 메서드 (Close)
    const closeProfileModal = () => {
        setProfileModal(false);
    };

    // 날짜 포맷하는 함수
    const formatChatDate = (dateString) => {
        const date = new Date(dateString);
        if (isToday(date)) {
            return format(date, 'HH:mm');
        } else if (isYesterday(date)) {
            return '어제';
        } else {
            return format(date, 'yyyy-M-d');
        }
    }

    // 검색 입력할 때마다 상태를 업데이트
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        // 필터 함수 호출
        filterOrgChart(event.target.value);
    };

    // 조직도에서 모든 직원 추출하는 함수
    const getAllEmployees = (data) => {
        const employees = [];
        data.forEach((dept) => {
            Object.values(dept.teams).forEach((team) => {
                employees.push(...team);
            });
        });
        console.log('employees:', employees);
        return employees;
    };

    // 로그인한 사용자 찾기
    useEffect(() => {
        if (userData && orgChartData.length > 0) {
            const foundUser = findUserInOrgChart(userData.emp_no, orgChartData);
            console.log('foundUser:', foundUser);
            if (foundUser) {
                setUser(foundUser);
            } else {
                console.error('Logged-in user not found in org chart data.');
            }
        }
    }, [userData, orgChartData]);

    // 조직도에서 사용자 찾는 함수
    const findUserInOrgChart = (emp_no, data) => {
        console.log('findUserInOrgChart의 emp_no:', emp_no);
        console.log('findUserInOrgChart의 data:', data);
        const allEmployees = getAllEmployees(data);
        return allEmployees.find((emp) => emp.emp_no === emp_no) || null;
    };

    // 검색 필터링 (조직도 데이터를 필터링)
    const filterOrgChart = (searchTerm) => {
        if (!searchTerm) {
            // 선택된 사용자 초기화
            setSelectedUser(null);
            return;
        }

        const lowercasedTerm = searchTerm.toLowerCase();

        // 직원 리스트에서 성명, 직급, 부서명으로 필터링
        const allEmployees = getAllEmployees(orgChartData);

        const matchingEmployees = allEmployees.filter(
            (emp) =>
                emp.emp_name.toLowerCase().includes(lowercasedTerm) ||
                emp.emp_posi_name?.toLowerCase().includes(lowercasedTerm) ||
                emp.emp_dept_name?.toLowerCase().includes(lowercasedTerm)
        );

        setSelectedUser(matchingEmployees.length > 0 ? matchingEmployees[0] : null);
    };

    // 채팅 목록의 프로필 클릭할 때 메서드
    const clickProfile = (emp_no) => {
        if (emp_no) {
            // 전달된 emp_no를 통해 사용자 정보를 찾고 업데이트
            const selectedProfile = findUserInOrgChart(emp_no, orgChartData);
            console.log('selectedProfile:', selectedProfile);
            if (selectedProfile) {
                setProfileInfo(selectedProfile);
            } else {
                console.error(`Profile not found for emp_no: ${emp_no}`);
            }
        } else {
            // 기본 값 또는 여러 명일 경우 기본 설정
            setProfileInfo({ emp_name: '그룹', emp_position: '' }); // 예시 값으로 기본 설정
        }
        setProfileModal(true);
    }

    // 채팅 새 창
    const chatting = async (room_no) => {
        try {
            console.log("room_no:", room_no);

            // 해당 room_no의 채팅방 정보 찾기
            const room = chatRoomList.find(room => room.room_no === room_no);
            console.log('room:', room);

            if (!room) return;

            const openChatRoom = openChats.find(chat => chat.room_no === room_no);

            if (openChatRoom && openChatRoom.window && !openChatRoom.window.closed) {
                // 열려있는 창 중에 같은 room_no의 창이 있다면 해당 창 보여주기
                openChatRoom.window.focus();
            } else {
                // 로그인한 사용자의 정보 찾기
                const currentUser = user;
                console.log('currentUser:', currentUser);

                console.log("orgChartData:", orgChartData);

                // orgChartData에서 emp_no에 맞는 직원 정보를 찾는 함수
                const findParticipantByEmpNo = (emp_no) => {
                    for (const dept of orgChartData) {
                        for (const teamKey in dept.teams) {
                            const team = dept.teams[teamKey];
                            const participant = team.find(emp => emp.emp_no === emp_no);
                            if (participant) return {
                                emp_no: participant.emp_no,
                                emp_name: participant.emp_name,
                                emp_profile: participant.emp_profile || 'https://via.placeholder.com/60',
                                emp_dept_name: dept.deptName,
                                dept_team_name: teamKey,
                                emp_posi_name: participant.posi_name || ''
                            };
                        }
                    }
                    return null; // 해당 emp_no를 찾지 못한 경우
                };

                // 참가자의 상세 정보를 얻기 위해 orgChartData에서 매핑
                const detailedParticipants = room.participantNos.map(emp_no => {
                    const participant = findParticipantByEmpNo(emp_no);
                    console.log('participant:', participant);
                    return participant || { emp_no, emp_name: 'Unknown', emp_profile: 'https://via.placeholder.com/60', emp_dept_name: '', dept_team_name: '', emp_posi_name: '' };
                });
                console.log('detailedParticipants:', detailedParticipants);

                // 채팅창으로 넘길 객체
                const chatData = {
                    room_no,
                    participants: detailedParticipants, // 상세 정보가 포함된 참가자 목록
                    messages: chatMessages[room_no] || [],
                    currentUser: currentUser || {}, // currentUser가 없을 경우 빈 객체로 처리
                };

                // 위치 조정
                if (offsetRight >= 100) {
                    setOffsetDown(20);
                    setOffsetRight(0);
                }

                const encodedData = encodeURIComponent(JSON.stringify(chatData));

                // 새 창 띄우기
                const newChat = window.open(
                    `/chatting/${room_no}?data=${encodedData}`,
                    `Chat Room ${room_no}`,
                    `width=800, height=600, top=${100 + offsetDown}, left=${1000 + offsetRight}, scrollbars=yes, resizable=no`
                );

                // 새 창 데이터 추가
                setOpenChats(preOpenChats => [
                    ...preOpenChats,
                    { room_no, window: newChat }
                ]);

                // 다음 창의 위치 조정
                setOffsetDown(preOffsetDown => preOffsetDown + 20);
                setOffsetRight(preOffsetRight => preOffsetRight + 20);
            }
        } catch (error) {
            console.error("Error opening chat: ", error);
        }
    };

    // 페이지가 로드될 때 모든 채팅방 목록을 불러오는 메서드
    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                console.log('1');
                // user가 null인 경우 API 요청을 중지
                if (!user || !user.emp_no) {
                    console.error("User is not set yet or emp_no is missing.");
                    return;
                }
                console.log('2');

                // 1. 사용자 emp_no로 모든 채팅방 목록 가져오기 (사용자가 참여하고 있는 채팅방 목록)
                const chatRoomResponse = await api.getChatRoomsByParticipant(user.emp_no);
                console.log('3');

                console.log('chatRoomResponse:', chatRoomResponse);
                // 서버에서 받아온 채팅방 데이터
                const chatRooms = chatRoomResponse.data;
                console.log('4');

                // 서버 응답이 배열인지 확인하고, 배열이 아니면 응답의 특정 키에서 배열을 추출
                if (Array.isArray(chatRooms)) {
                    console.log('5');

                    const processedChatRooms = chatRooms.map(room => {
                        // 로그인 사용자를 제외한 다른 참가자들만 각 채팅방 목록 이름에 저장
                        // filter로 사용자를 제외하고 남은 participant를 find 한다
                        const otherParticipants = room.room_participants.filter(participant => participant !== user.emp_no).map(participant => {
                            const emp = findUserInOrgChart(participant, orgChartData);
                            return emp ? {
                                emp_no: emp.emp_no,
                                emp_name: emp.emp_name,
                                emp_dept_name: emp.dept_name || '',
                                dept_team_name: emp.dept_team_name || '',
                                emp_posi_name: emp.posi_name || ''
                            } : { emp_no: participant, emp_name: '', emp_dept_name: '', dept_team_name: '', emp_posi_name: '' };
                        });
                        const participantNames = otherParticipants.map(part => part.emp_name).join(', ');
                        return { ...room, participantNames, participantNos: otherParticipants.map(part => part.emp_no) };
                    });
                    console.log('processedChatRooms:', processedChatRooms);
                    console.log('6');

                    // 2. 불러온 채팅방 목록인 processedChatRooms를 room_no로 각 채팅방의 모든 메시지들을 불러와 저장
                    const chatMessages = {};
                    const allRecentMessages = await Promise.all(
                        processedChatRooms.map(async (room) => {
                            // room_no 마다 각 채팅방의 모든 메시지를 가져오기
                            console.log('room.room_no:', room.room_no);
                            const chatResponse = await api.getMostRecentMessageByRoomNo(room.room_no);
                            console.log('chatResponse:', chatResponse);
                            console.log('chatResponse.data:', chatResponse.data);

                            const chatDataArray = chatResponse.data || [];

                            // 각 채팅방들에 대한 메시지를 모두 저장
                            chatMessages[room.room_no] = chatDataArray;

                            // 가장 최근 메시지 찾기
                            // chatDataArray 배열의 첫 번째 요소로 latest가 설정되어 순회 중인 message 값과 비교한다
                            // 따라서 reduce 함수의 콜백은 첫 번째 요소와 두 번쨰 요소를 비교하면서 시작되고, 최신의 메시지가 latest가 된다.
                            const mostRecentMessage = chatDataArray.reduce((latest, message) => {
                                if (new Date(message.chat_date) > new Date(latest.chat_date)) {
                                    return message;
                                } else if (new Date(message.chat_date).getTime() === new Date(latest.chat_date).getTime()) {
                                    return message.chat_no > latest.chat_no ? message : latest;
                                }
                                return latest;
                            }, chatDataArray[0] || {});

                            // mostRecentMessage를 사용하여 필요한 정보 저장
                            return {
                                room_no: room.room_no,
                                chat_content_recent: mostRecentMessage.chat_content || '',
                                chat_date_recent: mostRecentMessage.chat_date || '',
                                chat_no: mostRecentMessage.chat_no || 0,
                                unread: mostRecentMessage.chat_count || 0
                            };
                        })
                    );
                    console.log('7');

                    // 3. 가장 최근 메시지 정보들을 recentMessages 객체로 저장
                    // allRecentMessages 배열에 각각의 room_no가 저장되어있으므로 room_no를 키로 하여 저장
                    // → 가장 최근 메시지를 room_no를 키로 하는 객체로 변환하여 상태 업데이트
                    // 각 roomData 객체를 키-값으로 변환 후 객체화
                    const recentMessages = allRecentMessages.reduce((acc, roomData) => {
                        acc[roomData.room_no] = {
                            chat_content_recent: roomData.chat_content_recent,
                            chat_date_recent: roomData.chat_date_recent,
                            chat_no: roomData.chat_no,
                            unread: roomData.unread
                        };
                        return acc;
                    }, {});

                    console.log('8');

                    // 채팅방 목록을 chat_date_recent 기준으로 정렬하고, 날짜가 같다면 chat_no로 내림차순 정렬
                    const sortedChatRooms = processedChatRooms.map(room => {
                        return {
                            ...room,
                            ...recentMessages[room.room_no]
                        };
                    }).sort((a, b) => {
                        // chat_date_recent가 없는 경우 기본 날짜를 과거의 날짜(new Date(0))으로 설정하여 undefined 방지 - new Date(0) : 1970년 1월 1일 00:00:00 UTC (자바 스크립트의 Date 객체 시간의 시작점 기준, UNIX 시간의 시작 날짜)
                        // 따라서 채팅 날짜가 없다면 채팅 목록에서 가장 아래로 정렬된다
                        const dateA = a.chat_date_recent ? new Date(a.chat_date_recent) : new Date(0);
                        const dateB = b.chat_date_recent ? new Date(b.chat_date_recent) : new Date(0);

                        // 날짜가 다르면 chat_date_recent로 비교
                        if (dateA.getTime() !== dateB.getTime()) {
                            return dateB - dateA;
                        }

                        // 날짜가 같다면 chat_no로 내림차순 정렬
                        const chatNoA = a.chat_no || 0;
                        const chatNoB = b.chat_no || 0;
                        return chatNoB - chatNoA;
                    })
                    console.log('9');

                    // 정렬된 목록으로 업데이트
                    setChatRoomList(sortedChatRooms);
                    console.log('10');

                    // 각 채팅방들에 대한 메시지 업데이트
                    setChatMessages(chatMessages);
                    console.log('11');

                    // 최근 메시지 업데이트
                    // recentMessages에는 room_no로 구분되며 가장 최근 메시지(chat_content_recent), 가장 최근 전송 시간(chat_date_recent), 읽지 않은 수(unread)의 데이터를 가지고 있다
                    setRecentMessages(recentMessages);
                } else {
                    console.error("채팅방 목록 데이터가 배열 형태가 아닙니다:", chatRoomResponse);
                }
            } catch (error) {
                console.error('채팅방 목록을 불러오는 중 오류 발생:', error);
            }
        };
        if (user) {
            fetchChatRooms();
        }
    }, [user]);

    // OrgChart에서 사람 클릭 시 호출 함수
    const handleMemberClick = async (member) => {
        try {
            console.log('member:', member);
            // 선택한 멤버의 emp_no
            const selectedEmpNo = member.emp_no;
            console.log('selectedEmpNo:', selectedEmpNo);

            // 현재 채팅방 목록에서 해당 참여자들로 이루어진 채팅방을 찾기
            let existingChatRoom = chatRoomList.find(room => room.participantNos.includes(user.emp_no) && room.participantNos.includes(selectedEmpNo));

            // 존재하거나 새로 생성한 채팅방으로 이동
            if (existingChatRoom) {
                chatting(existingChatRoom.room_no);
                return;
            }

            // 채팅방이 없다면 새로운 채팅방 생성
            if (!existingChatRoom) {
                // 채팅방이 존재하지 않는 경우 새로운 채팅방을 생성
                const roomDate = format(new Date(), 'yyyy-MM-dd HH:mm');
                const newRoomData = {
                    room_date: roomDate,
                    room_participants: [user.emp_no, selectedEmpNo],
                };

                // PUT 요청으로 새로운 채팅방 생성
                const response = await api.createChatRoom(newRoomData);

                if (response && response.data) {
                    // 새로 생성된 채팅방으로 연결
                    chatting(response.data.room_no);
                    return;
                }
            }
            console.log('existingChatRoom:', existingChatRoom);
        } catch (error) {
            console.error("Error handling member click: ", error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

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
                                <input type='text' placeholder='성명, 직급, 부서명 검색' value={searchTerm} onChange={handleSearchChange} onKeyDown={(e) => { if (e.key === 'Enter') filterOrgChart(searchTerm); }}></input>
                                <button onClick={() => filterOrgChart(searchTerm)}><i className="material-icons">search</i></button>
                            </div>
                            <hr>
                            </hr>
                            <div className={styles.orgChartUI}>
                                <OrgChart selectedUser={selectedUser} onMemberClick={handleMemberClick} enableDrag={false} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.chatRoomList}>
                        <div className={styles.chatRoomList_title}>
                            <h3>채팅 목록</h3>
                        </div>
                        <div className={styles.chatRoomList_content}>
                            {chatRoomList.map((room) => (
                                <div key={room.room_no} className={styles.eachChat} onClick={() => { chatting(room.room_no) }} >
                                    <div className={styles.eachChat_profile} onClick={(e) => { e.stopPropagation(); room.participantNos?.length === 1 ? clickProfile(room.participantNos[0]) : clickProfile(); }}>
                                        <img src="https://via.placeholder.com/60" alt="Profile" className={styles.image} />
                                    </div>
                                    <div className={styles.eachChat_info}>
                                        <div className={styles.eachChat_row}>
                                            <div className={styles.eachChat_name}>
                                                {room.participantNames}
                                            </div>
                                            <div className={styles.eachChat_lastTime}>
                                                {recentMessages[room.room_no]?.chat_date_recent ? formatChatDate(recentMessages[room.room_no].chat_date_recent) : ''}
                                            </div>
                                        </div>
                                        <div className={styles.eachChat_row}>
                                            <div className={styles.eachChat_content}>
                                                {recentMessages[room.room_no]?.chat_content_recent}
                                            </div>
                                            <div className={styles.eachChat_unread} style={{ display: recentMessages[room.room_no]?.unread === 0 ? 'none' : 'block' }}>
                                                {recentMessages[room.room_no]?.unread}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Modal show={profileModal} onHide={closeProfileModal} dialogClassName={styles.modal_content} centered>
                                <Modal.Header className={styles.modal_header} closeButton onClick={(e) => e.stopPropagation()}>
                                    <Modal.Title className={styles.modal_title}>{profileInfo.emp_name} 님의 프로필</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className={styles.modal_body}>
                                        <div className={styles.modal_body_profile}>
                                            <img src="https://via.placeholder.com/150" alt="Profile" className={styles.image} />
                                        </div>
                                        <div className={styles.modal_body_info}>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td><p className={styles.infoTitle}>소속 부서</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td><p className={styles.infoValue}>{profileInfo.dept_name} {profileInfo.dept_team_name}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td><p className={styles.infoTitle}>내선 번호</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td><p className={styles.infoValue}>{profileInfo.emp_phone}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td><p className={styles.infoTitle}>이 &nbsp;메 &nbsp;일</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td><p className={styles.infoValue}>{profileInfo.emp_email}</p></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer className={styles.modal_footer}>
                                    <Button variant="primary" onClick={(e) => { e.stopPropagation(); closeProfileModal() }} >
                                        메일 전송
                                    </Button>
                                    <Button variant="primary" onClick={(e) => { e.stopPropagation(); chatting(profileInfo.name); closeProfileModal() }} >
                                        채팅하기
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyUserChatRoom;