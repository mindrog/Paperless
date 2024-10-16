import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/company/company_mypage.module.css';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import '../../styles/style.css';

function CompanyUserMypage() {

    const location = useLocation();
    const navigate = useNavigate();
    const profileName = location.pathname.toLowerCase().startsWith('/company/admin')
        ? '강동원'
        : location.pathname.toLowerCase().startsWith('/company/user')
            ? '배수지'
            : '사용자';

    // 모달 상태 관리
    const [showModal, setShowModal] = useState(false);
    const [showPwChangeModal, setShowPwChangeModal] = useState(false);

    // 전화번호 변경 모달 열기/닫기 함수
    const handleUsernumUpdate = () => {
        setShowModal(true); // 모달 열기
    };

    const handleCloseModal = () => {
        setShowModal(false); // 모달 닫기
        setNewPhoneNumber('');
    };

    // 전화번호 입력 시 하이픈(-) 자동 추가
    const [phoneNumber, setPhoneNumber] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');

    const handlePhoneNumberChange = (event) => {
        const value = event.target.value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자는 제거
        let formattedValue = value;

        if (value.length > 3 && value.length <= 7) {
            formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
        } else if (value.length > 7) {
            formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
        }

        setPhoneNumber(formattedValue);
    };

    const handleNewPhoneNumberChange = (event) => {
        const value = event.target.value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자는 제거
        let formattedValue = value;

        if (value.length > 3 && value.length <= 7) {
            formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
        } else if (value.length > 7) {
            formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
        }

        setNewPhoneNumber(formattedValue);
    };

    // 비밀번호 변경 모달 열기/닫기 함수
    const handleUserPwChangebtn = () => {
        setShowPwChangeModal(true); // 모달 열기
    };

    const handleUserPwCloseModal = () => {
        setShowPwChangeModal(false); // 모달 닫기
        setNewPassword('');
    };

    // 비밀번호 표시 토글 상태 관리
    const [showCurrentPassword, setShowCurrentPassword] = useState(false); // 현재 비밀번호 보기
    const [showNewPassword, setShowNewPassword] = useState(false); // 새 비밀번호 보기
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 새 비밀번호 확인 보기

    // 새 비밀번호 필드 상태 관리
    const [newPassword, setNewPassword] = useState('');

    // 비밀번호 보기 토글 함수
    const toggleShowCurrentPassword = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleShowNewPassword = () => {
        if (newPassword.length > 0) {
            setShowNewPassword(!showNewPassword);
        }
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // 새 비밀번호 입력 핸들러
    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    return (
        <div className="container-xl">
            <div className={styles.mypageContainer}>
                <div className={styles.mypageProfil}>
                    <img src="https://via.placeholder.com/150" alt="Profile" className={styles.image} />
                    <div className={styles.profiltitle}>
                        <p>기획전략팀</p>
                        <div className={styles.titlename}>
                            <div className={styles.userName}>{profileName}</div>
                            <div className={styles.userGrade}>대리</div>
                        </div>
                    </div>
                </div>
                <div className="container text-center">
                    <div className={styles.userInfo}>
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <div className={styles.userIdBox}>
                                    <div className={styles.userIdtitle}>◼  사&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  번</div>
                                    <div className='userId'>&nbsp;20201234</div>
                                </div>
                            </div>

                            <div className={styles.changePossible}>
                                <div className={styles.userNumBox}>
                                    <div className={styles.userNumtitle}>◼ 전화번호</div>
                                    <div className='userNum'>010-1234-9876</div>
                                    <Button variant="primary" className={styles.userNumUpdatebtnInput} onClick={handleUsernumUpdate}>수정</Button>
                                </div>

                                <div className={styles.userPwBox}>
                                    <div className={styles.userPwtitle}>◼ 비밀번호</div>
                                    <div className={styles.userPw}></div>
                                    <Button variant="primary" className={styles.userPwChangebtnInput} onClick={handleUserPwChangebtn}>변경</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.userAnnualInfobox}>
                <h3 className={styles.userAnnualInfo_title}>연차 정보</h3>
                <hr className={styles.titlebar} />
                <div className={styles.tablebox}>
                    <Table className={styles.userAnnualInfoTable}>
                        <tbody>
                            <tr className={styles.tableHead}>
                                <td colSpan={4}>단위: 개</td>
                            </tr>
                            <tr>
                                <td className={styles.infotitle}>총 근무 기간</td>
                                <td className={styles.infoValue}>2021.10.01~ 현/(3년)</td>
                                <td className={styles.infotitle}>총 연차 수</td>
                                <td className={styles.infoValue}>15</td>
                            </tr>
                            <tr>
                                <td className={styles.infotitle}>사용된 연차 수</td>
                                <td className={styles.infoValue}>5</td>
                                <td className={styles.infotitle}>사용가능 연차 수</td>
                                <td className={styles.infoValue}>10</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* 모달창 */}
            <Modal show={showModal} onHide={handleCloseModal} centered className={styles.userNumModal}>
                <Modal.Header closeButton>
                    <Modal.Title className={styles.modalTitle}>전화번호 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modal_body}>
                    <Form className={styles.userNum_form}>
                        <Form.Group controlId="userPhoneNumber" className={styles.formPhoneNumber}>
                            <Form.Label>기존 전화번호</Form.Label>
                            <Form.Control
                                type="text"
                                className={styles.modal_input}
                                value={phoneNumber}
                                placeholder='010-1234-5678'
                                onChange={handlePhoneNumberChange} // 자동으로 하이픈 추가
                                maxLength={13} // 010-1234-5678 형식에 맞춰 최대 길이를 13으로 설정
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhoneNumber" className={styles.formPhoneNumberNew}>
                            <Form.Label>새 전화번호</Form.Label>
                            <Form.Control
                                type="text"
                                className={styles.modal_input}
                                value={newPhoneNumber}
                                onChange={handleNewPhoneNumberChange} // 자동으로 하이픈 추가
                                maxLength={13} // 010-1234-5678 형식에 맞춰 최대 길이를 13으로 설정
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className={styles.modal_footer}>
                    <Button variant="primary" onClick={handleCloseModal} className={styles.userNumUpdatebtn}>
                        저장
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showPwChangeModal} onHide={() => setShowPwChangeModal(false)} centered className={styles.userPwModal}>
                <Modal.Header closeButton>
                    <Modal.Title className={styles.modalTitle}>비밀번호 변경</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className={styles.password_form}>
                        {/* 현재 비밀번호 */}
                        <Form.Group controlId="currentPassword" className={styles.formPw}>
                            <Form.Label>현재 비밀번호</Form.Label>
                            <div className={styles.password_container}>
                                <Form.Control
                                    type={showCurrentPassword ? "text" : "password"}
                                    required
                                    className={styles.modal_input_pw}
                                />
                                <Button variant="link" onClick={toggleShowCurrentPassword} className={styles.toggle_password}>
                                    <span className="material-icons">
                                        {showCurrentPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </Button>
                            </div>
                        </Form.Group>

                        {/* 새 비밀번호 */}
                        <Form.Group controlId="newPassword" className={styles.formPwNew}>
                            <Form.Label>새 비밀번호</Form.Label>
                            <div className={styles.password_container}>
                                <Form.Control
                                    type={showNewPassword ? "text" : "password"}
                                    required
                                    className={styles.modal_input_pw}
                                    autoComplete="off"
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                />
                                <Button variant="link" onClick={toggleShowNewPassword} className={styles.toggle_password} disabled={newPassword.length === 0}>
                                    <span className="material-icons">
                                        {showNewPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </Button>
                            </div>
                        </Form.Group>

                        {/* 새 비밀번호 확인 */}
                        <Form.Group controlId="confirmNewPassword" className={styles.formPwNew}>
                            <Form.Label>새 비밀번호 확인</Form.Label>
                            <div className={styles.password_container}>
                                <Form.Control
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    className={styles.modal_input_pw}
                                    autoComplete="off"
                                />
                                <Button variant="link" onClick={toggleShowConfirmPassword} className={styles.toggle_password} disabled={newPassword.length === 0}>
                                    <span className="material-icons">
                                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </Button>
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className={styles.modal_footer}>
                    <Button variant="primary" className={styles.userPwChangebtn}>
                        저장
                    </Button>
                    {/* <Button variant="secondary" onClick={handleUserPwCloseModal}>
                        취소
                    </Button> */}
                </Modal.Footer>
            </Modal>

        </div >
    );
}

export default CompanyUserMypage;