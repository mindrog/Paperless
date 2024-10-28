import React, { useEffect, useState } from 'react';
import api from '../layout/api';
import styles from '../../styles/company/company_chatroom.module.css';
import OrgChart from '../layout/org_chart';
import { Button, Modal } from 'react-bootstrap';
import { format, isToday, isYesterday } from 'date-fns';
import { useSelector } from 'react-redux';

function CompanyUserChatRoom() {
    // Redux에서 사용자 정보 가져오기
    const userData = useSelector((state) => state.user.data);
    // const userPosi = useSelector((state) => state.user.userPosi);

    const empNo = userData.emp_no;

    // Redux에서 사용자 정보 가져온 후 저장할 상태 변수
    const [user, setUser] = useState(null);

    // 직원 정보 저장 로직
    useEffect(() => {
        // empList에서 empNo와 일치하는 직원 찾기
        const foundUser = empList.find(emp => emp.emp_no === empNo);
        if (foundUser) {
            setUser(foundUser);
        }
    }, []);

    // ** 더미 데이터 ** //
    // 직원
    const empList = [
        { emp_no: 2, emp_name: '배수지', emp_email: 'suzy@digitalsolution.com', emp_phone: '010-1234-5678', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 100, emp_posi_no: 4 },
        { emp_no: 3, emp_name: '강동원', emp_email: 'dongwon@digitalsolution.com', emp_phone: '010-8765-4321', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 100, emp_posi_no: 6 },
        { emp_no: 4, emp_name: '김태리', emp_email: 'taeri@digitalsolution.com', emp_phone: '010-2345-6789', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 500, emp_posi_no: 3 },
        { emp_no: 5, emp_name: '이준호', emp_email: 'junho@digitalsolution.com', emp_phone: '010-3456-7890', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 110, emp_posi_no: 4 },
        { emp_no: 6, emp_name: '박서준', emp_email: 'seojun@digitalsolution.com', emp_phone: '010-5555-1234', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 200, emp_posi_no: 3 },
        { emp_no: 7, emp_name: '이서진', emp_email: 'seojin@digitalsolution.com', emp_phone: '010-1010-2020', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 200, emp_posi_no: 4 },
        { emp_no: 8, emp_name: '유아인', emp_email: 'yooain@digitalsolution.com', emp_phone: '010-3030-4040', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 210, emp_posi_no: 5 },
        { emp_no: 9, emp_name: '공효진', emp_email: 'gonghj@digitalsolution.com', emp_phone: '010-5050-6060', emp_profile: 'https://via.placeholder.com/60', emp_comp_no: 1, emp_dept_no: 100, emp_posi_no: 2 },
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
        { dept_no: 200, dept_name: '마케팅부서', dept_team_name: '디지털마케팅팀' },
        { dept_no: 210, dept_name: '마케팅부서', dept_team_name: '브랜드팀' },
        { dept_no: 300, dept_name: '영업부서', dept_team_name: '국내영업팀' },
        { dept_no: 310, dept_name: '영업부서', dept_team_name: '해외영업팀' },
        { dept_no: 400, dept_name: 'HR부서', dept_team_name: '채용팀' },
        { dept_no: 410, dept_name: 'HR부서', dept_team_name: '인사관리팀' },
        { dept_no: 500, dept_name: '구매부서', dept_team_name: '구매팀' },
        { dept_no: 510, dept_name: '구매부서', dept_team_name: '자재관리팀' },
    ];

    // 직급
    const posiList = [
        { posi_no: 1, posi_name: '사원' },
        { posi_no: 2, posi_name: '주임' },
        { posi_no: 3, posi_name: '대리' },
        { posi_no: 4, posi_name: '차장' },
        { posi_no: 5, posi_name: '과장' },
        { posi_no: 6, posi_name: '차장' },
        { posi_no: 7, posi_name: '이사' },
        { posi_no: 8, posi_name: '상무' },
        { posi_no: 9, posi_name: '전무' },
        { posi_no: 10, posi_name: '부사장' },
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

    // 채팅 목록의 프로필 클릭할 때 메서드
    const clickProfile = (emp_no) => {
        if (emp_no) {
            // 전달된 emp_no를 통해 사용자 정보를 찾고 업데이트
            const selectedProfile = processedEmpList.find(emp => emp.emp_no === emp_no);
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

            if (!room) return;

            const openChatRoom = openChats.find(chat => chat.room_no === room_no);

            if (openChatRoom && openChatRoom.window && !openChatRoom.window.closed) {
                // 열려있는 창 중에 같은 room_no의 창이 있다면 해당 창 보여주기
                openChatRoom.window.focus();
            } else {
                // 로그인한 사용자의 정보 찾기
                const currentUser = processedEmpList.find(emp => emp.emp_no === user.emp_no);

                // 채팅창으로 넘길 객체
                const chatData = {
                    room_no,
                    participantNos: room.participantNos || [],
                    participants: room.participantNames || '',
                    messages: chatMessages[room_no] || [],
                    currentUser: currentUser ? {
                        emp_no: currentUser.emp_no,
                        emp_name: currentUser.emp_name,
                        emp_email: currentUser.emp_email,
                        emp_phone: currentUser.emp_phone,
                        emp_comp_name: currentUser.emp_comp_name,
                        emp_dept_name: currentUser.emp_dept_name,
                        emp_team_name: currentUser.emp_team_name,
                        emp_posi_name: currentUser.emp_posi_name,
                        emp_profile: currentUser.emp_profile,
                    } : {} // currentUser가 없을 경우 빈 객체로 처리
                };

                // 위치 조정
                if (offsetRight >= 100) {
                    setOffsetDown(20);
                    setOffsetRight(0);
                }

                const encodedData = encodeURIComponent(JSON.stringify(chatData));

                // // 참가자 정보와 메시지 저장
                // // JSON.stringify: 문자열로 저장
                // localStorage.setItem(`chatting-room-${room_no}`, JSON.stringify({
                //     room_no, 
                //     participants: room.participantNames
                // }));

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
                // user가 null인 경우 API 요청을 중지
                if (!user || !user.emp_no) {
                    console.error("User is not set yet or emp_no is missing.");
                    return;
                }

                // 1. 사용자 emp_no로 모든 채팅방 목록 가져오기 (사용자가 참여하고 있는 채팅방 목록)
                const chatRoomResponse = await api.getChatRoomsByParticipant(user.emp_no);
                // 서버에서 받아온 채팅방 데이터
                const chatRooms = chatRoomResponse.data;

                // 서버 응답이 배열인지 확인하고, 배열이 아니면 응답의 특정 키에서 배열을 추출
                if (Array.isArray(chatRooms)) {
                    // 각 채팅방의 room_participants를 processedEmpList 메서드로 처리하여 참가자의 숫자형 데이터를 이름인 문자열로 생성
                    const processedChatRooms = chatRooms.map(room => {
                        // 로그인 사용자를 제외한 다른 참가자들만 각 채팅방 목록 이름에 저장
                        // filter로 사용자를 제외하고 남은 participant를 find 한다
                        const otherParticipants = room.room_participants.filter(participant => String(participant) !== String(user.emp_no)).map(participant => {
                            // paricipant를 processedEmpList 메서드로 문자열 생성
                            const emp = processedEmpList.find(e => e.emp_no === Number(participant));
                            // 해당 내용이 있다면 저장하고 없으면 ''로 저장
                            return emp ? { emp_no: emp.emp_no, emp_name: emp.emp_name } : { emp_no: participant, emp_name: '' };
                        });

                        // 참가자 emp_no만 추출하여 배열로 저장
                        const participantNos = otherParticipants.map(part => part.emp_no);

                        // 참가자 이름만 추출하여 ,로 연결
                        const participantNames = otherParticipants.map(part => part.emp_name).join(', ');

                        // 각 room에 participantNames와 participantNos 추가
                        return {
                            ...room,
                            participantNos,     // 참가자 emp_no 배열
                            participantNames    // 참가자 이름 문자열
                        };
                    });

                    // 2. 불러온 채팅방 목록인 processedChatRooms를 room_no로 각 채팅방의 모든 메시지들을 불러와 저장
                    const chatMessages = {};
                    const allRecentMessages = await Promise.all(
                        processedChatRooms.map(async (room) => {
                            // room_no 마다 각 채팅방의 모든 메시지를 가져오기
                            const chatResponse = await api.getMostRecentMessageByRoomNo(room.room_no);
                            const chatDataArray = chatResponse.data || [];

                            // 각 채팅방들에 대한 메시지를 모두 저장
                            chatMessages[room.room_no] = chatDataArray;

                            // 가장 최근 메시지 찾기
                            // chatDataArray 배열의 첫 번째 요소로 latest가 설정되어 순회 중인 message 값과 비교한다
                            // 따라서 reduce 함수의 콜백은 첫 번째 요소와 두 번쨰 요소를 비교하면서 시작되고, 최신의 메시지가 latest가 된다.
                            const mostRecentMessage = chatDataArray.reduce((latest, message) => {
                                return new Date(message.chat_date) > new Date(latest.chat_date) ? message : latest;
                            }, chatDataArray[0] || {});

                            // mostRecentMessage를 사용하여 필요한 정보 저장
                            return {
                                room_no: room.room_no,
                                chat_content_recent: mostRecentMessage.chat_content || '',
                                chat_date_recent: mostRecentMessage.chat_date || '',
                                unread: mostRecentMessage.chat_count || 0
                            };
                        })
                    );

                    // 3. 가장 최근 메시지 정보들을 recentMessages 객체로 저장
                    // allRecentMessages 배열에 각각의 room_no가 저장되어있으므로 room_no를 키로 하여 저장
                    // → 가장 최근 메시지를 room_no를 키로 하는 객체로 변환하여 상태 업데이트
                    // 각 roomData 객체를 키-값으로 변환 후 객체화
                    const recentMessages = allRecentMessages.reduce((acc, roomData) => {
                        acc[roomData.room_no] = {
                            chat_content_recent: roomData.chat_content_recent,
                            chat_date_recent: roomData.chat_date_recent,
                            unread: roomData.unread
                        };
                        return acc;
                    }, {});

                    // 채팅방 목록을 최근 메시지 전송 시간 기준으로 정렬 (최신 메시지가 위로 오도록 내림차순)
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
                        return dateB - dateA;
                    })

                    // 정렬된 목록으로 업데이트
                    setChatRoomList(sortedChatRooms);

                    // 각 채팅방들에 대한 메시지 업데이트
                    setChatMessages(chatMessages);

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

    // 상태 변경 후의 값을 추적하는 useEffect
    useEffect(() => {
        console.log("Updated chatRoomList:", chatRoomList);
    }, [chatRoomList]);

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
                                <input type='text' placeholder='성명, 직급, 부서명 검색'></input>
                                <button><i className="material-icons">search</i></button>
                            </div>
                            <hr>
                            </hr>
                            <div className={styles.orgChartUI}>
                                <OrgChart />
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
                                                        <td><p className={styles.infoValue}>{profileInfo.emp_dept_name} {profileInfo.emp_team_name}</p></td>
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