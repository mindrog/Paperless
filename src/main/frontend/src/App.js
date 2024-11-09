import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
import CompanyAdminApproval from './pages/company_admin/CompanyAdminApproval';
import CompanyUserDraftApprDetailWork from './pages/company_user/CompanyUserDraftApprDetailWork';
import CompanyUserMain from './pages/company_user/CompanyUserMain';
import CompanyUserMypage from './pages/company_user/CompanyUserMypage';
import CompanyUserEmail from './pages/company_user/CompanyUserEmail';
import CompanyUserEmailSend from './pages/company_user/CompanyUserEmailSend';
import CompanyUserEmailDetail from './pages/company_user/CompanyUserEmailDetail';
import CompanyUserDraftWriteWork from './pages/company_user/CompanyUserDraftWriteWork';
import CompanyUserDraftWriteAtten from './pages/company_user/CompanyUserDraftWriteAtten';
import CompanyUserDraftWritePurc from './pages/company_user/CompanyUserDraftWritePurc';
import CompanyUserDraftFormWork from './pages/company_user/CompanyUserDraftFormWork';
import CompanyUserDraftFormPurc from './pages/company_user/CompanyUserDraftFormPurc';
import CompanyUserDraftFormAtten from './pages/company_user/CompanyUserDraftFormAtten';
import CompanyUserDraftDetailWork from './pages/company_user/CompanyUserDraftDetailWork';
import CompanyUserDraftDetailPurc from './pages/company_user/CompanyUserDraftDetailPurc';
import CompanyUserDraftDetailAtten from './pages/company_user/CompanyUserDraftDetailAtten';
import CompanyUserDraftDocAll from './pages/company_user/DraftDoc/CompanyUserDraftDocAll';
import CompanyUserDraftDocDraft from './pages/company_user/DraftDoc/CompanyUserDraftDocDraft';
import CompanyUserDraftDocPenAppr from './pages/company_user/DraftDoc/CompanyUserDraftDocPenAppr';
import CompanyUserDraftDocMyuser from './pages/company_user/DraftDoc/CompanyUserDraftDocMyuser';
import CompanyUserStock from './pages/company_user/CompanyUserStock';
import CompanyUserCalender from './pages/company_user/CompanyUserCalender';
import CompanyPage from './pages/company_admin/CompanyCompanypage';
import Menubar from './pages/layout/menubar';
import GraphChart from './pages/layout/GraphChart';
import ApprovalLine from './pages/layout/ApprovalLine';
import ErrorBoundary from './pages/layout/ErrorBoundary';
import './App.css';
import './styles/style.css';

import { BrowserRouter as Router, Route, Routes, useLocation, useMatch } from 'react-router-dom';
import Chatting from './pages/company_user/CompanyUserChatting';
import CompanyUserChatRoom from './pages/company_user/CompanyUserChatRoom';

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
        <DndProvider backend={HTML5Backend}>
        <Router>
            <div className='App'>
                <HeaderToggle />
                <MenubarToggle isMenuOpen={isMenuOpen} />
                <ApprovalLineToggle />
                <main className='app'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/inquiry' element={<Inquiry />} />
                        <Route path='/inquiry/success' element={<InquirySuccess />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/email_Auth' element={<EmailAuth />} />
                        <Route path='/inquiry/write' element={<InquiryWrite />} />
                        <Route path='/email_Auth/searchPW' element={<SearchPW />} />
                        {/* 시스템 관리자 */}``
                        <Route path='/system/admin/inquiry' element={<SystemAdminInquiry />} />
                        <Route path='/system/admin/member' element={<SystemAdminMember />} />

                        {/* 기업 관리자 */}
                        <Route path='/company/admin/' element={<CompanyAdminMain />} />
                        <Route path='/company/admin/member' element={<CompanyAdminMember />} />
                        <Route path='/company/info' element={<CompanyPage />} />
                        <Route path='/company/admin/approval' element={<CompanyAdminApproval />} />

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
                        <Route path='/company/user/draft/doc/penforappr' element={<CompanyUserDraftDocPenAppr />} />
                        <Route path='/company/user/draft/doc/myuser' element={<CompanyUserDraftDocMyuser />} />

                        <Route path='/company/user/draft/detail/work' element={<CompanyUserDraftDetailWork />} />
                        <Route path='/company/user/draft/detail/work/:reportId' element={<CompanyUserDraftDetailWork />} />
                        <Route path='/company/user/draft/detail/purchase' element={<CompanyUserDraftDetailPurc />} />
                        <Route path='/company/user/draft/detail/purchase/:reportId' element={<CompanyUserDraftDetailPurc />} />
                        <Route path='/company/user/draft/detail/attendance' element={<CompanyUserDraftDetailAtten />} />
                        <Route path='/company/user/draft/detail/attendance/:reportId' element={<CompanyUserDraftDetailAtten />} />
                        <Route path='/company/user/draft/form/work' element={<CompanyUserDraftFormWork />} />
                        <Route path='/company/user/draft/form/purchase' element={<CompanyUserDraftFormPurc />} />
                        <Route path='/company/user/draft/form/attendance' element={<CompanyUserDraftFormAtten />} />
                        <Route path='/company/user/draft/write/work' element={<CompanyUserDraftWriteWork />} />
                        <Route path='/company/user/draft/write/attendance' element={<CompanyUserDraftWriteAtten />} />
                        <Route path='/company/user/draft/write/purchase' element={<CompanyUserDraftWritePurc />} />
                        <Route path='/company/user/draft/approval/detail/work' element={<CompanyUserDraftApprDetailWork />} />
                        <Route path='/company/user/draft/approval/detail/work/:reportId' element={<CompanyUserDraftApprDetailWork />} />

                        {/* 재고관리 */}
                        <Route path='/company/user/stock' element={<CompanyUserStock />} />

                        {/* 캘린더 */}
                        <Route path='/company/user/calendar' element={<CompanyUserCalender />} />

                        {/* 채팅 */}
                        <Route path='/chatroom' element={<CompanyUserChatRoom />} />
                        <Route path='/chatting/:name' element={<Chatting />} />

                    </Routes>
                </main>
                <FooterToggle />
            </div>
        </Router>
    </DndProvider>
    );
}

// /chatting으로 시작하는 URL에서 Header 숨기기
function HeaderToggle() {
    const location = useLocation();
    const HeaderHiddenPaths = ['/chatting','/login','/email_Auth','/email_Auth/searchPW', '/chatroom'];

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
    const MenubarHiddenPaths = ['/','/inquiry/Write', '/inquiry', '/inquiry/success', '/login', '/email_Auth', '/inquiry/wirte', '/chatroom', '/chatting', '/email_Auth/searchPW'];
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
    const showGraphChart = allowedPaths.some(path => location.pathname.startsWith(path));

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
            <ErrorBoundary>
                <div className='ApprovalLine'>
                    <ApprovalLine />
                </div>
            </ErrorBoundary>
            )}
        </>
    );
}

export default App;
