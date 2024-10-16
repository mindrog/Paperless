import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './pages/layout/header';
import Footer from './pages/layout/footer';
import Home from './pages/layout/home';
import Inquiry from './pages/common/inquiry';
import Login from './pages/layout/login';
import Inquiry_Success from './pages/common/inquiry_success';
import Inquiry_write from './pages/common/inquiry_write';
import Email_Auth from './pages/layout/email_auth';
import System_admin_inquiry from './pages/system_admin/system_admin_inquiry';
import System_admin_member from './pages/system_admin/system_admin_member';
import Company_admin_main from './pages/company_admin/company_admin_main';
import Company_admin_memeber from './pages/company_admin/company_admin_member';
import Company_admin_email from './pages/company_admin/company_admin_email';
import Company_admin_email_send from './pages/company_admin/company_admin_email_send';
import Company_admin_approval from './pages/company_admin/company_admin_approval';
import Company_admin_approval_detail from './pages/company_admin/company_admin_approval_detail';
import Company_user_main from './pages/company_user/company_user_main';
import Company_user_mypage from './pages/company_user/company_user_mypage';
import Company_user_email from './pages/company_user/company_user_email';
import Company_user_email_send from './pages/company_user/company_user_email_send';
import Company_user_email_detail from './pages/company_user/company_user_email_detail';
import Company_user_draft_write_work from './pages/company_user/company_user_draft_write_work';
import Company_user_draft_write_atte from './pages/company_user/company_user_draft_write_atten';
import Company_user_draft_write_purc from './pages/company_user/company_user_draft_write_purc';
import Company_user_draft_form from './pages/company_user/company_user_draft_form';
import Company_user_draft_detail from './pages/company_user/company_user_draft_detail';
import Company_user_dratf_doc_all from './pages/company_user/company_user_draft_doc_all';
import Company_user_dratf_doc_draft from './pages/company_user/company_user_draft_doc_draft';
import Company_user_dratf_doc_appr from './pages/company_user/company_user_draft_doc_appr';
import Company_user_chat from './pages/company_user/company_user_chat';
import Menubar from './pages/layout/menubar';
import './App.css';
import './styles/style.css';

import { BrowserRouter as Router, Route, Routes, useLocation, useMatch } from 'react-router-dom';
import Chatting from './pages/company_user/company_user_chatting';

function App() {
    const [hello, setHello] = useState('');

    useEffect(() => {
        axios.get('/api/hello')
            .then(response => setHello(response.data))
            .catch(error => console.log(error));
    }, []);

    // 메뉴바
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Router>
            <div className='App'>
                <HeaderToggle />
                <MenubarToggle isMenuOpen={isMenuOpen} />
                <main className='app'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/inquiry' element={<Inquiry />} />
                        <Route path='/inquiry/success' element={<Inquiry_Success />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/email_Auth' element={<Email_Auth />} />
                        <Route path='/inquiry/wirte' element={<Inquiry_write />} />
                        <Route path='/system/admin/inquiry' element={<System_admin_inquiry />} />
                        <Route path='/system/admin/member' element={<System_admin_member />} />
                        <Route path='/company/admin/' element={<Company_admin_main />} />
                        <Route path='/company/admin/member' element={<Company_admin_memeber />} />
                        <Route path='/company/admin/email' element={<Company_admin_email />} />
                        <Route path='/company/admin/email/send' element={<Company_admin_email_send />} />
                        <Route path='/company/admin/approval' element={<Company_admin_approval />} />
                        <Route path='/company/admin/approval/detail' element={<Company_admin_approval_detail />} />
                        <Route path='/company/user/' element={<Company_user_main />} />
                        <Route path='/company/user/mypage' element={<Company_user_mypage />} />
                        <Route path='/company/user/email' element={<Company_user_email />} />
                        <Route path='/company/user/email/send' element={<Company_user_email_send />} />
                        <Route path='/company/user/email/detail' element={<Company_user_email_detail />} />
                        <Route path='/company/user/draft/doc/all' element={<Company_user_dratf_doc_all />} />
                        <Route path='/company/user/draft/doc/draft' element={<Company_user_dratf_doc_draft />} />
                        <Route path='/company/user/draft/doc/approval' element={<Company_user_dratf_doc_appr />} />
                        <Route path='/company/user/draft/detail' element={<Company_user_draft_detail />} />
                        <Route path='/company/user/draft/form' element={<Company_user_draft_form />} />
                        <Route path='/company/user/draft/write/work' element={<Company_user_draft_write_work />} />
                        <Route path='/company/user/draft/write/attendance' element={<Company_user_draft_write_atte />} />
                        <Route path='/company/user/draft/write/purchase' element={<Company_user_draft_write_purc />} />
                        <Route path='/company/user/chat' element={<Company_user_chat />} />
                        <Route path='/chatting/:name' element={<Chatting />} />
                    </Routes>
                </main>
                <FooterToggle />
            </div>
        </Router>
    );
}

// /chatting으로 시작하는 URL에서 Header 숨기기
function HeaderToggle() {
    const location = useLocation();
    const HeaderHiddenPaths = ['/chatting'];

    return (
        <>
            {!HeaderHiddenPaths.some(path => location.pathname.startsWith(path)) && (
                <div className='Header'>
                    <Header />
                </div>
            )}
        </>
    );
}

function MenubarToggle({ isMenuOpen }) {
    const location = useLocation();
    const chattingPath = useMatch('/chatting/:name');
    const MenubarHiddenPaths = ['/', '/inquiry', '/inquiry/success', '/login', '/email_Auth', '/inquiry/wirte', '/chatting'];
    const isMenubarHiddenPaths = MenubarHiddenPaths.includes(location.pathname) || chattingPath;

    return (
        <>
            {!isMenubarHiddenPaths && (
                <div className='Menubar'>
                    <Menubar isMenuOpen={isMenuOpen} />
                </div>
            )}
        </>
    );
}

function FooterToggle() {
    const location = useLocation();
    const FooterPaths = ['/', '/inquiry', '/inquiry/success', '/login', '/email_Auth', '/inquiry/wirte'];

    return (
        <>
            {FooterPaths.includes(location.pathname) && (
                <div className='Footer'>
                    <Footer />
                </div>
            )}
        </>
    );
}


export default App;
