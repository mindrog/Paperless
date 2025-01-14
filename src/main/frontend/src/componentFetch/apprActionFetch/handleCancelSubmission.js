// // "상신 취소"와 "회수" 버튼 클릭 이벤트 핸들러 추가
// const handleCancelSubmission = async () => {
//     try {
//       const response = await fetch(`/api/report/cancel/${reportId}`, {
//         method: 'POST',
//         headers: {
//           'Authorization': token,
//           'Content-Type': 'application/json',
//         },
//       });
      
//       if (response.ok) {
//         alert('상신이 취소되었습니다.');
//         navigate('/company/user/draft/doc/myuser'); 
//       } else {
//         alert('상신 취소에 실패했습니다.');
//       }
//     } catch (error) {
//       console.error('Error cancelling submission:', error);
//       alert('상신 취소 중 오류가 발생했습니다.');
//     }
//   };
  