// ComposeButton.js
import React from 'react';
import styles from '../../styles/component/ComposeButton.module.css'; // 스타일 파일 경로는 실제 위치에 맞게 수정하세요

function ComposeButton({ onClick,className }) {
  return (
    <button className={`${styles.composeButton} ${className}`}
    onClick={onClick}>
      메일 작성
    </button>
  );
}

export default ComposeButton;