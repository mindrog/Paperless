import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import '../../styles/layout/layout.css';
import logo from '../../img/logo-img.png';

const HeaderOne = ({ logoSize, toggleMenu }) => (
    <header className='header-one'>
        <div className='logo_Img_start'>
            {/* 햄버거 아이콘이 중간 화면에서만 보이도록 className 적용 */}
            <i className="material-symbols-outlined hamburger" onClick={toggleMenu}>menu</i>
            <Link to="/" className="link-logo">
    <img 
        src={logo} 
        className='Header-logo-start' 
        alt='Logo One' 
        style={{ transform: `scale(${logoSize})` }} 
    />
    </Link>
        </div>
    </header>
);

const HeaderTwo = ({ toggleMenu }) => (
    <header className='header-two'>
        <div className='logo_Img'>
        <Link to='/'>
            <img src={logo} className='Header-logo' alt='Logo Two' />
            </Link> 
        </div>
        <div className='menu_Container'>

        </div>
        <div className='btn_Container'>
            <Link to='/inquiryWrite'>
            <button type='button' className='header_btn'>문의하기</button>
            </Link><Link to='/inquiry'>
            <button type='button' className='header_btn'>신청하기</button>
            </Link><Link to='/login'>
            <button type='button' className='header_btn'>로그인</button>
            </Link>
        </div>
    </header>
);
const HeaderThree = ({ toggleMenu }) => (
    <header className='header-two'>
        <div className='logo_Img'>
        <Link to='/'>
            <img src={logo} className='Header-logo' alt='Logo Two' />
            </Link> 
        </div>
        <div className='menu_Container'>

        </div>
        <div className='btn_Container'>
            <Link to='/login'>
            <button type='button' className='header_btn'>로그아웃</button>
            </Link>
        </div>
    </header>
);
const Header = ({ toggleMenu }) => {
    const [lastScrollY, setLastScrollY] = useState(0);
    const [headerToShow, setHeaderToShow] = useState('one');
    const [logoSize, setLogoSize] = useState(1); // 초기 로고 크기
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        // 로컬 스토리지에서 JWT 토큰 확인
        const token = localStorage.getItem('jwt');
        if (token) {
            setHasToken(true);
        } else {
            setHasToken(false);
        }
    }, []); // 처음 렌더링 시 한 번만 실행

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
            {hasToken ? (
                <HeaderThree toggleMenu={toggleMenu} />
            ) : (
                headerToShow === 'one' ? (
                    <HeaderOne logoSize={logoSize} toggleMenu={toggleMenu} />
                ) : (
                    <HeaderTwo toggleMenu={toggleMenu} />
                )
            )}
        </>
    );
}

export default Header;
