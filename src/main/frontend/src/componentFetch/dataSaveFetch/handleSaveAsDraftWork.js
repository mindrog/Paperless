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
      const payload = {
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
      };

      const response = await fetch('/api/saveasdraft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
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
