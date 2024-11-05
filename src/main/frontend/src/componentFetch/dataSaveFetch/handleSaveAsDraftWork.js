import React, { forwardRef, useImperativeHandle } from 'react';

const HandleSaveAsDraft = forwardRef(({
  reportTitle,
  reportContent,
  reportDate,
  repoStartTime,
  repoEndTime,
  reportStatus,
  selectedApprovers,
  selectedReferences,
  selectedReceivers,
  files,
  token,
  setIsSaved,
  setSaveDate,
  setShowAlert,
  reportId,      // reportId 추가
  setReportId    // reportId 저장을 위한 함수
}, ref) => {
  const saveDraftToDB = async () => {
    console.log("token:", token);
    console.log("HandleSaveAsDraft - Report ID:", reportId);

    try {
      // FormData를 사용하여 파일과 데이터를 함께 전송
      const formData = new FormData();

      // reportId가 있으면 폼 데이터에 포함하여 업데이트로 처리
      if (reportId) {
        formData.append('reportId', reportId);
      }

      // JSON 데이터 추가
      formData.append('reportTitle', reportTitle);
      formData.append('reportContent', reportContent);
      formData.append('reportDate', reportDate);
      formData.append('repoStartTime', repoStartTime);
      formData.append('repoEndTime', repoEndTime);
      formData.append('reportStatus', reportStatus);
      formData.append('selectedApprovers', JSON.stringify(selectedApprovers));
      formData.append('selectedReferences', JSON.stringify(selectedReferences));
      formData.append('selectedReceivers', JSON.stringify(selectedReceivers));

      // 파일 배열 추가
      files.forEach((file, index) => {
        formData.append('files', file); 
      });

      const response = await fetch('/api/saveasdraft', {
        method: 'POST',
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to save draft');

      const result = await response.json();
      console.log("Save result:", result);

      // reportId 설정 및 부모 컴포넌트에 업데이트
      setReportId(result.reportId);
      setIsSaved(true);
      setSaveDate(new Date().toLocaleDateString('ko-KR'));
      setShowAlert(true);

      return result; // 결과 반환
    } catch (error) {
      console.error('Error saving draft:', error);
      setShowAlert(true);
      return null; // 오류 발생 시 null 반환
    }
  };

  useImperativeHandle(ref, () => saveDraftToDB);

  return null;
});

export default HandleSaveAsDraft;
