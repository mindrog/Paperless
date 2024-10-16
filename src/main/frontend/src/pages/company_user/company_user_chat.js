import React, { useState } from 'react';
import styles from '../../styles/company/company_chat.module.css';
import OrgChart from '../layout/org_chart';
import { Button, Modal } from 'react-bootstrap';

function Company_user_chat() {
    // 채팅 목록 불러오기 (DB 연결 시)
    // const [chatList, setChatList] = useState([]);

    // 직원 (더미 데이터)
    const userList = [
        { name: '장원영', dept: '콘텐츠 기획팀', phone: '010-1234-1234', email: 'jang0101@naver.com' },
        { name: '박보영', dept: '콘텐츠 기획팀', phone: '010-2345-2345', email: 'boyoung0202@naver.com' },
        { name: '박보검', dept: '콘텐츠 기획팀', phone: '010-3456-3456', email: 'gumgum0303@gmail.com' },
        { name: '전지현', dept: '콘텐츠 기획팀', phone: '010-4567-4567', email: 'jjh0404@naver.com' },
        { name: '이도현', dept: '콘텐츠 기획팀', phone: '010-5678-5678', email: 'dodo0505@gmail.com' },
        { name: '김태리', dept: '콘텐츠 기획팀', phone: '010-6789-6789', email: 'kimlee0606@gmail.com' },
        { name: '강동원', dept: '콘텐츠 기획팀', phone: '010-7890-7890', email: 'dongwon0707@naver.com' },
    ];

    // 채팅 목록 (더미 데이터)
    const chatList = [
        {
            profile: 'https://via.placeholder.com/75', name: '장원영', content: `수지야
            오늘 점심 뭐 먹지?`, lastTime: '2024-10-15 11:30', unread: 2
        },
        {
            profile: 'https://via.placeholder.com/75', name: '박보영', content: `대리님, 프레젠테이션 자료 이메일로 전송했습니다.
            확인 부탁드립니다.`, lastTime: '2024-10-15 09:15', unread: 1
        },
        {
            profile: 'https://via.placeholder.com/75', name: '박보검', content: `대리님, 요청하신 파일 보내드렸습니다.
            확인하시고, 각 부서에 전달 바랍니다.
            회의할 때 10부만 복사해주세요.`, lastTime: '2024-10-14 16:00', unread: 0
        },
        {
            profile: 'https://via.placeholder.com/75', name: '전지현', content: `안녕하세요, 대리님. 
            전지현입니다.
            전화 부탁드립니다.`, lastTime: '2024-10-14 14:32', unread: 0
        },
        {
            profile: 'https://via.placeholder.com/75', name: '이도현', content: `대리님, 지난 달 매출 정리하신 파일 보고서 찾았습니다!
            감사합니다~`, lastTime: '2024-10-11 11:30', unread: 0
        },
        {
            profile: 'https://via.placeholder.com/75', name: '김태리', content: `대리님, 안녕하세요. 
            오늘 회의 참석 가능하실까요?`, lastTime: '2024-10-10 10:30', unread: 0
        },
        { profile: 'https://via.placeholder.com/75', name: '강동원', content: `대리님, 커피 어떤 거 드실래요?`, lastTime: '2024-10-09 09:00', unread: 0 },
        {
            profile: 'https://via.placeholder.com/75', name: '+82 2-1234-1234', content: `[Web발신]
            (광고) 공식몰
            단 하루 100원 판매!`, lastTime: '2024-10-08 12:00', unread: 10
        },
    ];

    // 프로필 모달창 상태 변수
    const [profileModal, setProfileModal] = useState(false);

    // 프로필 데이터에 대한 변수
    const [profileInfo, setProfileInfo] = useState('');

    // 모달창 상태 메서드 (Open)
    const showProfileModal = () => {
        setProfileModal(true);
    };

    // 모달창 상태 메서드 (Close)
    const closeProfileModal = () => {
        setProfileModal(false);
    };

    // 채팅 목록의 프로필 클릭할 때 메서드
    const clickProfile = (name) => {
        // 클릭한 프로필의 name과 userList에서 비교하여 데이터를 저장하는 변수
        const user = userList.find(user => user.name === name);

        if (user) {
            // user가 있다면 profileInfo에 user의 데이터를 저장
            setProfileInfo(user);
        } else {
            // user가 없다면 profileInfo의 name 속성에 가져온 name을 저장
            setProfileInfo({ name: name });
        }
        setProfileModal(true);
    }

    // 창이 열려있는지 확인하는 변수
    const [openChats, setOpenChats] = useState([]);

    // 새 창이 열릴 때마다 위치 조정해주는 변수
    const [offsetDown, setOffsetDown] = useState(0);
    const [offsetRight, setOffsetRight] = useState(0);

    // 채팅 새 창
    const chatting = (name) => {
        // 열려있는 창의 이름과 열려는 창의 이름이 같은지 확인하는 변수
        const openChatName = openChats.find(chat => chat.name === name);

        if (openChatName && openChatName.window && !openChatName.window.closed) {
            // 열려있는 창 중에 같은 이름의 창이 있다면 해당 창 보여주기
            openChatName.window.focus();
        } else {
            // 일정 위치로 가면 위치 재조정
            if (offsetRight >= 100) {
                setOffsetDown(20);
                setOffsetRight(0);
            };

            // 새 창 띄우며 관련 데이터 저장 (name이라는 식별 이름을 가진 새 창을 열어주며, 같은 이름의 창을 생성하려는 경우 이미 존재하는 창을 열어줌)
            const newChat = window.open(`/chatting/${name}`, name, `width=800, height=600, top=${100 + offsetDown}, left=${1000 + offsetRight}, scrollbars=yes, resizable=no`)

            // 새 창 데이터 추가
            setOpenChats(preOpenChats => [
                ...preOpenChats,
                { name, window: newChat }
            ]);

            // 다음 창의 위치 조정
            setOffsetDown(preOffsetDown => preOffsetDown + 20);
            setOffsetRight(preOffsetRight => preOffsetRight + 20);
        }
    };

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
                    <div className={styles.chatList}>
                        <div className={styles.chatList_title}>
                            <h3>채팅 목록</h3>
                        </div>
                        <div className={styles.chatList_content}>
                            {chatList.map((chat, index) => (
                                <div key={index} className={styles.eachChat} onClick={() => chatting(chat.name)} >
                                    <div className={styles.eachChat_profile} onClick={(e) => { e.stopPropagation(); clickProfile(chat.name); }}>
                                        <img src={chat.profile} alt="Profile" className={styles.image} />
                                    </div>
                                    <div className={styles.eachChat_info}>
                                        <div className={styles.eachChat_row}>
                                            <div className={styles.eachChat_name}>
                                                {chat.name}
                                            </div>
                                            <div className={styles.eachChat_lastTime}>
                                                {chat.lastTime}
                                            </div>
                                        </div>
                                        <div className={styles.eachChat_row}>
                                            <div className={styles.eachChat_content}>
                                                {chat.content}
                                            </div>
                                            <div className={styles.eachChat_unread} style={{ display: chat.unread === 0 ? 'none' : 'block' }}>
                                                {chat.unread}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Modal show={profileModal} onHide={closeProfileModal} dialogClassName={styles.modal_content} size='lg' centered>
                                <Modal.Header className={styles.modal_header} closeButton onClick={(e) => e.stopPropagation()}>
                                    <Modal.Title className={styles.modal_title}>{profileInfo.name}님의 프로필</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className={styles.modal_body}>
                                        <div className={styles.modal_body_profile}>
                                            <img src="https://via.placeholder.com/180" alt="Profile" className={styles.image} />
                                        </div>
                                        <div className={styles.modal_body_info}>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td><h5 className={styles.infoTitle}>소속 부서</h5></td>
                                                        <td><p className={styles.infoValue}>{profileInfo.dept}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td><h5 className={styles.infoTitle}>내선 번호</h5></td>
                                                        <td><p className={styles.infoValue}>{profileInfo.phone}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td><h5 className={styles.infoTitle}>이 &nbsp;메 &nbsp;일</h5></td>
                                                        <td><p className={styles.infoValue}>{profileInfo.email}</p></td>
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

export default Company_user_chat;