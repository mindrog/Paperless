import React, { useState, useEffect } from 'react';
import './layout.css';
import logo from '../../img/logo-img.png';

const HeaderOne = ({ logoSize }) => (
    <header className='header-one'>
        <div className='logo_Img_start'>
            <img src={logo} className='Header-logo-start' alt='Logo One' style={{ transform: `scale(${logoSize})` }} />
        </div>
    </header>
);

const HeaderTwo = () => (
    <header className='header-two'>
        <div className='logo_Img' >
            <img src={logo} className='Header-logo' alt='Logo Two' />
        </div>
        <div className='menu_Container'>
           
        </div>
        <div className='btn_Container'>
           <button type='button' className='header_btn'>문의하기</button>
           <button type='button' className='header_btn'>신청하기</button>
           <button type='button' className='header_btn'>로그인</button>
        </div>
    </header>
);

const Header = () => {
    const [lastScrollY, setLastScrollY] = useState(0);
    const [headerToShow, setHeaderToShow] = useState('one');
    const [logoSize, setLogoSize] = useState(1); // 초기 로고 크기

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // 로고 크기 조정
        const newLogoSize = Math.max(0.5, 1 - currentScrollY / 400); // 스크롤에 따라 크기 조정
        setLogoSize(newLogoSize);

        if (currentScrollY > 100) {
            setHeaderToShow('two'); // 스크롤이 100 이상일 때 HeaderTwo 표시
        } else {
            setHeaderToShow('one'); // 그렇지 않을 때 HeaderOne 표시
        }

        setLastScrollY(currentScrollY); // 마지막 스크롤 위치 업데이트
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <>
            {headerToShow === 'one' ? <HeaderOne logoSize={logoSize} /> : <HeaderTwo logoSize={logoSize} />}
        </>
    );
}

export default Header;