import React from 'react';
import { useLocation } from 'react-router-dom';
import CompanyUserDraftWriteWork from '../company_user/CompanyUserDraftWriteWork';
import CompanyUserDraftWriteAtten from '../company_user/CompanyUserDraftWriteAtten';
import CompanyUserDraftWritePurc from './CompanyUserDraftWritePurc';

function CompanyUserDraftDetail() {
  const location = useLocation(); // 현재 경로를 가져옴

  // 경로에 따라 렌더링할 컴포넌트를 결정
  const renderForm = () => {
    switch (location.pathname) {
      case '/company/user/draft/write/work':
        return <CompanyUserDraftWriteWork />;
      case '/company/user/draft/write/attendance':
        return <CompanyUserDraftWriteAtten />;
      case '/company/user/draft/write/purchase':
        return <CompanyUserDraftWritePurc />;
      default:
        return <p>올바른 경로가 아닙니다.</p>;
    }
  };

  return (
    <div>
      {renderForm()}
    </div>
  );
}

export default CompanyUserDraftDetail;
