// import React, { useState } from 'react';
// import CompanyUserChatRoom from './CompanyUserChatRoom';
// import Chatting from './CompanyUserChatting';

// function CompanyUserChatApp() {
//   const [recentMessages, setRecentMessages] = useState({});

//   // chatRoomList와 recentMessages를 관리하도록 부모 컴포넌트에서 관리
//   const updateRecentMessages = (room_no, newMessage) => {
//     setRecentMessages((prevMessages) => ({
//       ...prevMessages,
//       [room_no]: {
//         chat_content_recent: newMessage.chat_content,
//         chat_date_recent: newMessage.chat_date,
//         unread: newMessage.unread || 0
//       }
//     }));
//   };

//   return (
//     <div>
//       <CompanyUserChatRoom
//         recentMessages={recentMessages}
//       />
//       <Chatting
//         updateRecentMessages={updateRecentMessages}
//       />
//     </div>
//   );
// }

// export default CompanyUserChatApp;
