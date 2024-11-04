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
  setShowAlert
}, ref) => {
  const saveDraftToDB = async () => {
    try {
      // FormData를 사용하여 파일과 데이터를 함께 전송
      const formData = new FormData();

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
      files.forEach((file) => {
        formData.append('files', file); // `files` 키로 여러 파일을 전송할 수 있음
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
      setIsSaved(true);
      setSaveDate(new Date().toLocaleDateString('ko-KR'));
      setShowAlert(true);
    } catch (error) {
      console.error('Error saving draft:', error);
      setShowAlert(true);
    }
  };

  useImperativeHandle(ref, () => saveDraftToDB);

  return null;
});

export default HandleSaveAsDraft;