import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Header from './pages/layout/header';
import Footer from './pages/layout/footer';
import Home from './pages/layout/home';
import Inquiry from './pages/common/inquiry';
import Login from './pages/layout/login';
import InquirySuccess from './pages/common/InquirySuccess';
import InquiryWrite from './pages/common/InquiryWrite';
import EmailAuth from './pages/layout/email_auth';
import SearchPW from './pages/layout/searchPW';
import SystemAdminInquiry from './pages/system_admin/SystemAdminInquiry';
import SystemAdminMember from './pages/system_admin/SystemAdminMember';
import CompanyAdminMain from './pages/company_admin/CompanyAdminMain';
import CompanyAdminMember from './pages/company_admin/CompanyAdminMember';
import CompanyAdminEmail from './pages/company_admin/CompanyAdminEmail';
import CompanyAdminEmailSend from './pages/company_admin/CompanyAdminEmailSend';
import CompanyAdminApproval from './pages/company_admin/CompanyAdminApproval';
import CompanyAdminApprovalDetail from './pages/company_admin/CompanyAdminApprovalDetail';
import CompanyUserMain from './pages/company_user/CompanyUserMain';
import CompanyUserMypage from './pages/company_user/CompanyUserMypage';
import CompanyUserEmail from './pages/company_user/CompanyUserEmail';
import CompanyUserEmailSend from './pages/company_user/CompanyUserEmailSend';
import CompanyUserEmailDetail from './pages/company_user/CompanyUserEmailDetail';
import CompanyUserDraftWriteWork from './pages/company_user/CompanyUserDraftWriteWork';
import CompanyUserDraftWriteAtten from './pages/company_user/CompanyUserDraftWriteAtten';
import CompanyUserDraftWritePurc from './pages/company_user/CompanyUserDraftWritePurc';
import CompanyUserDraftForm from './pages/company_user/CompanyUserDraftForm';
import CompanyUserDraftDetail from './pages/company_user/CompanyUserDraftDetail';
import CompanyUserDraftDocAll from './pages/company_user/CompanyUserDraftDocAll';
import CompanyUserDraftDocDraft from './pages/company_user/CompanyUserDraftDocDraft';
import CompanyUserDraftDocAppr from './pages/company_user/CompanyUserDraftDocAppr';
import CompanyUserStock from './pages/company_user/CompanyUserStock';
import CompanyUserCalender from './pages/company_user/CompanyUserCalender';
import CompanyUserChat from './pages/company_user/CompanyUserChat';
import Menubar from './pages/layout/menubar';
import GraphChart from './pages/layout/GraphChart';
import ApprovalLine from './pages/layout/ApprovalLine';
// import PageNav from './pages/layout/PageNav';
import './App.css';
import './styles/style.css';

import { BrowserRouter as Router, Route, Routes, useLocation, useMatch } from 'react-router-dom';
import Chatting from './pages/company_user/CompanyUserChatting';

function App() {
    

    useEffect(() => {
          Modal.setAppElement('#root');
        
       
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
                <GraphChartToggle />
                <ApprovalLineToggle />
                {/* <PaginationToggle /> */}
                <main className='app'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/inquiry' element={<Inquiry />} />
                        <Route path='/inquiry/success' element={<InquirySuccess />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/email_Auth' element={<EmailAuth />} />
                        <Route path='/inquiry/write' element={<InquiryWrite />} />
                        <Route path='/email_Auth/searchPW' element={<SearchPW />} />
                        {/* 시스템 관리자 */}
                        <Route path='/system/admin/inquiry' element={<SystemAdminInquiry />} />
                        <Route path='/system/admin/member' element={<SystemAdminMember />} />

                        {/* 기업 관리자 */}
                        <Route path='/company/admin/' element={<CompanyAdminMain />} />
                        <Route path='/company/admin/member' element={<CompanyAdminMember />} />
                        <Route path='/company/admin/email' element={<CompanyAdminEmail />} />
                        <Route path='/company/admin/email/send' element={<CompanyAdminEmailSend />} />
                        <Route path='/company/admin/approval' element={<CompanyAdminApproval />} />
                        <Route path='/company/admin/approval/detail' element={<CompanyAdminApprovalDetail />} />

                        {/* 기업 사용자 */}
                        <Route path='/company/user/' element={<CompanyUserMain />} />
                        <Route path='/company/user/mypage' element={<CompanyUserMypage />} />

                        {/* 이메일 */}
                        <Route path='/company/user/email' element={<CompanyUserEmail />} />
                        <Route path='/company/user/email/send' element={<CompanyUserEmailSend />} />
                        <Route path='/company/user/email/detail' element={<CompanyUserEmailDetail />} />

                        {/* 기안 관련 */}
                        <Route path='/company/user/draft/doc/all' element={<CompanyUserDraftDocAll />} />
                        <Route path='/company/user/draft/doc/draft' element={<CompanyUserDraftDocDraft />} />
                        <Route path='/company/user/draft/doc/approval' element={<CompanyUserDraftDocAppr />} />
                        <Route path='/company/user/draft/detail' element={<CompanyUserDraftDetail />} />
                        <Route path='/company/user/draft/form' element={<CompanyUserDraftForm />} />
                        <Route path='/company/user/draft/write/work' element={<CompanyUserDraftWriteWork />} />
                        <Route path='/company/user/draft/write/attendance' element={<CompanyUserDraftWriteAtten />} />
                        <Route path='/company/user/draft/write/purchase' element={<CompanyUserDraftWritePurc />} />

                        {/* 재고관리 */}
                        <Route path='/company/user/stock' element={<CompanyUserStock />} />

                        {/* 캘린더 */}
                        <Route path='/company/user/calender' element={<CompanyUserCalender />} />

                        {/* 채팅 */}
                        <Route path='/company/user/chat' element={<CompanyUserChat />} />
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
    const HeaderHiddenPaths = ['/chatting','/login','/email_Auth','/email_Auth/searchPW'];

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
    const MenubarHiddenPaths = ['/', '/inquiry', '/inquiry/success', '/login', '/email_Auth', '/inquiry/wirte', '/chatting','/email_Auth/searchPW'];
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
    const FooterPaths = ['/', '/inquiry', '/inquiry/success', '/email_Auth', '/inquiry/wirte'];

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

// 그래프차트 main에서만 보이기
function GraphChartToggle() {
    const location = useLocation();
    const allowedPaths = ['/company/user/', '/company/admin/'];  // GraphChart를 보여줄 경로

    return (
        <>
            {allowedPaths.includes(location.pathname) && (
                <div className='GraphChart'>
                    <GraphChart />
                </div>
            )}
        </>
    );
}

// 결재선
function ApprovalLineToggle() {
    const location = useLocation();
    const allowedPaths = ['/company/user/draft/write/work', '/company/user/draft/write/attendance', '/company/user/draft/write/purchase'];  

    return (
        <>
            {allowedPaths.includes(location.pathname) && (
                <div className='ApprovalLine'>
                    <ApprovalLine />
                </div>
            )}
        </>
    );
}

// 페이징네이션
// function PaginationToggle() {
//     const location = useLocation();
//     const allowedPaths = ['/company/user/stock', '/company/admin/member'];

//     return (
//         <>
//             {allowedPaths.includes(location.pathname) && (
//                 <div className='PageNav'>
//                     <PageNav />
//                 </div>
//             )}
//         </>
//     );
// }


export default App;
