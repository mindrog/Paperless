import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // 환경 변수에서 API 기본 URL 가져오기
  headers: {
    'Content-Type': 'application/json', // 요청 헤더에 JSON 형식 지정
  },
});

// 인터셉터를 추가하여 인증 토큰을 넣거나 요청 전후 처리를 할 수 있음
// 예시로 인증 토큰 추가하는 인터셉터 (필요시 활성화):
// api.interceptors.request.use(config => {
//   config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// ***** 채팅방 (Chatroom) ***** //

// 1. 채팅방 목록 조회 (GET 요청)
api.getChatRoomsByParticipant = (emp_no) => {
  // 서버로부터 모든 채팅방 목록을 가져옴
  return api.get('/chatroom', {
    params: {
      emp_no: emp_no,
    },
  });
};

// 2. 채팅방 생성 (PUT 요청)
api.createChatRoom = (data) => {
  // 새로운 채팅방을 생성함 (데이터에는 채팅방의 정보가 포함됨)
  return api.put('/chatroom', data);
};

// 3. 채팅방 정보 수정 (POST 요청)
api.updateChatRoom = (room_no, data) => {
  // 특정 채팅방의 정보를 업데이트함
  // room_no는 업데이트하려는 채팅방의 번호, data는 수정할 정보
  return api.post(`/chatroom/${room_no}`, data);
};

// 4. 채팅방 삭제 (DELETE 요청)
api.deleteChatRoom = (room_no) => {
  // 특정 채팅방을 삭제함
  // room_no는 삭제할 채팅방의 번호
  return api.delete(`/chatroom/${room_no}`);
};

// ***** 채팅 메시지 (Chat) ***** //

// 5. 특정 채팅방의 가장 최근 메시지 조회 (GET 요청)
api.getMostRecentMessageByRoomNo = (room_no) => {
  return api.get('/chat', {
    params: {
      chat_room_no: room_no
    }
  });
};

// 6. 특정 채팅방의 모든 메시지 조회 (GET 요청)
api.getMessagesByRoomNo = (room_no) => {
  return api.get('/chat', {
    params: {
      chat_room_no: room_no
    }
  })
};

// 7. 특정 채팅방의 읽지 않은 메시지 수 조회 (GET 요청)
api.getChatCountByRoomNo = (room_no) => {
  // 특정 채팅방의 읽지 않은 메시지 개수를 가져옴
  return api.get(`/chat/unread`, {
    params: {
      chat_room_no: room_no,
    },
  });
};

// 8. 채팅 메시지 전송 (PUT 요청)
api.sendMessage = (data) => {
  // 데이터 확인
  console.log('Sending message data:', data);
  // 새로운 메시지를 전송함 (데이터에는 메시지 내용이 포함됨)
  return api.put('/chat', data);
};

// 9. 채팅 메시지 삭제 (DELETE 요청)
api.deleteChatMessage = (chat_room_no, chat_no) => {
  // 특정 채팅 메시지를 삭제함
  // chat_room_no는 채팅방 번호, chat_no는 삭제할 메시지의 번호
  return api.delete(`/chat/${chat_room_no}/${chat_no}`);
};

export default api;