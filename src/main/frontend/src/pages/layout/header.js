import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import '../../styles/layout/layout.css';
import logo from '../../img/logo-img.png'; // 로고 이미지 경로
import { setUserData } from '../../store/userSlice';


const HeaderOne = ({ logoSize, toggleMenu }) => (
    <header className='header-one'>
        <div className='logo_Img_start'>
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
        <div className='menu_Container'></div>
        <div className='btn_Container'>
            <Link to='/inquiry/Write'>
                <button type='button' className='header_btn'>문의하기</button>
            </Link>
            <Link to='/inquiry'>
                <button type='button' className='header_btn'>도입신청</button>
            </Link>
            <Link to='/login'>
                <button type='button' className='header_btn'>로그인</button>
            </Link>
        </div>
    </header>
);

const HeaderThree = ({ toggleMenu, userData, handleLogout }) => {
    const navigate = useNavigate();

    const goToLink = () => {
        if (userData.emp_role === "super") {
            navigate("/system/admin/inquiry");
        } else if (userData.emp_role === "admin") {
            navigate("/company/admin/member");
        } else {
            navigate("/company/user");
        }
    };

    return (
        <header className='header-two'>
            <div className='logo_Img'>
                <img src={logo} className='Header-logo' alt='Logo Two' onClick={goToLink}/>
            </div>
            <div className='menu_Container'></div>
            <div className='btn_Container'>
                <p className='header_emp_name'>{userData.emp_name} 님 </p>
                <button type='button' className='header_btn' onClick={handleLogout}>
                    로그아웃
                </button>
            </div>
        </header>
    );
};
const GoLink = () => {
    const userData = useSelector((state) => state.user.data);
    const navigate = useNavigate();
    if (userData.emp_role === "super") {
        navigate("/system/admin/inquiry");
    } else if (userData.emp_role === "admin") {
        navigate("/company/admin/member");
    } else {
        navigate("/company/user");
    }
}
const Header = ({ toggleMenu }) => {
    const [lastScrollY, setLastScrollY] = useState(0);
    const [headerToShow, setHeaderToShow] = useState('one');
    const [logoSize, setLogoSize] = useState(1);
    const userData = useSelector((state) => state.user.data);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // useNavigate 훅 추가
    
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            // 필요한 경우 토큰으로 추가 작업 수행
        }
    }, []);

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const newLogoSize = Math.max(0.5, 1 - currentScrollY / 400);
        setLogoSize(newLogoSize);

        if (currentScrollY > 100) {
            setHeaderToShow('two');
        } else {
            setHeaderToShow('one');
        }

        setLastScrollY(currentScrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    const handleLogout = () => {
        localStorage.removeItem('jwt'); // 로컬 스토리지에서 토큰 제거
        dispatch(setUserData(null)); // Redux 스토어에서 유저 데이터 제거
        navigate('/'); // 리다이렉트
    };

    return (
        <>
            {userData ? (
                <HeaderThree toggleMenu={toggleMenu} userData={userData} handleLogout={handleLogout} />
            ) : (
                headerToShow === 'one' ? (
                    <HeaderOne logoSize={logoSize} toggleMenu={toggleMenu} />
                ) : (
                    <HeaderTwo toggleMenu={toggleMenu} />
                )
            )}
        </>
    );
};

export default Header;
