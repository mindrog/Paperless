import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/layout/layout.css';

const Footer = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <footer>
            <div className='footer_btn_container'>
                <button className='footer_btn' onClick={() => handleNavigation('/')}>개인정보 처리 방침</button>
                <button className='footer_btn' onClick={() => handleNavigation('/')}>이용 약관</button>
                <button className='footer_btn' onClick={() => handleNavigation('/inquiry')}>문의하기</button>
            </div>
            <div className='footer_company_info_container'>
                <div className='footer_company_info_compname'>
                    ㈜페이퍼리스
                </div>
                <div className='footer_company_info'>
                    사업자 등록번호 : 999-99-99999 대표 : 최민경
                </div>
                <div className='footer_company_info'>
                    06626 서울시 서초구 서초대로74길 45 엔데버타워 3층
                </div>
            </div>
        </footer>
    );
}

export default Footer;