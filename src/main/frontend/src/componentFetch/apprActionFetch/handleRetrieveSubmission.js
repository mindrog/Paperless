// const handleRetrieveSubmission = async ( token ) => {
//     try {
//       const response = await fetch(`/api/report/retrieve/${reportId}`, {
//         method: 'POST',
//         headers: {
//           'Authorization': token,
//           'Content-Type': 'application/json',
//         },
//       });
      
//       if (response.ok) {
//         alert('문서가 회수되었습니다.');
//         navigate('/company/user/draft/doc/myuser');
//       } else {
//         alert('회수에 실패했습니다.');
//       }
//     } catch (error) {
//       console.error('Error retrieving submission:', error);
//       alert('회수 중 오류가 발생했습니다.');
//     }
//   };