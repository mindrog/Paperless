// CompanyUserMypage.js

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/company/company_mypage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, Table, Modal, Spinner } from 'react-bootstrap';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import '../../styles/style.css';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../../store/userSlice';

function CompanyUserMypage() {
    const location = useLocation();
    const navigate = useNavigate();
    const employeeData = useSelector((state) => state.user.data); // employee 테이블을 가져옵니다.
    const userPosition = useSelector((state) => state.user.userPosi); // 직책을 가져옵니다.

    const dispatch = useDispatch();

    // 모달 상태 관리
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showPwChangeModal, setShowPwChangeModal] = useState(false);

    // 전화번호 입력 상태
    const [phoneNumber, setPhoneNumber] = useState(employeeData.emp_phone || '');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');

    // 이메일 입력 상태
    const [emailAddr, setEmailAddr] = useState(employeeData.emp_email || '');
    const [newEmailAddr, setNewEmailAddr] = useState('');

    // 비밀번호 변경 상태
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // 비밀번호 표시 토글 상태
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 프로필 이미지 상태
    const [profileImage, setProfileImage] = useState(employeeData.emp_profile || "https://via.placeholder.com/150");
    const [isUploading, setIsUploading] = useState(false);

    // 추가된 상태 변수들
    const [employeeInfo, setEmployeeInfo] = useState(employeeData);

    // 파일 입력 레퍼런스
    const fileInputRef = useRef(null);

    // JWT 토큰 가져오기
    const getToken = () => {
        const token = localStorage.getItem('jwt');
        return token ? token : '';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };
    const calculateYearsAndMonths = (dateString) => {
        const joinDate = new Date(dateString);
        const today = new Date();

        let years = today.getFullYear() - joinDate.getFullYear();
        let months = today.getMonth() - joinDate.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        return `${years}년 ${months}개월`;
    };

    useEffect(() => {
        const fetchEmpInfo = async () => {
            try {
                const response = await fetch(`/api/getdept/${employeeData.emp_dept_no}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': getToken(),
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
                        navigate('/login');
                        return;
                    }
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                const data = await response.json();

                // employeeInfo 업데이트
                setEmployeeInfo(prevState => ({
                    ...prevState,
                    dept_name: data.dept_name,
                    dept_team_name: data.dept_team_name,
                }));

            } catch (error) {
                console.error('Error fetching employee info:', error);
                alert('직원 정보를 불러오는 중 오류가 발생했습니다.');
            }
        };

        if (employeeData && employeeData.emp_dept_no) {
            fetchEmpInfo();
        }
    }, [employeeData, navigate]);

    // 전화번호 변경 핸들러
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

    // 이메일 변경 핸들러
    const hnadleEmailAddrChange = (event) => {
    };

    const hnadleNewEmailAddrChange = (event) => {
    };

    // 전화번호 변경 모달 열기 함수
    const handleUsernumUpdate = () => {
        setShowPhoneModal(true); // 모달 열기
        setPhoneNumber(employeeData.emp_phone || '');
    };

    // 이메일 변경 모달 열기 함수
    const handleUserEmailUpdate = () => {
        setShowEmailModal(true);
        setEmailAddr(employeeData.emp_email || '');
    };

    // 사용자 정보 가져오기 함수
    const fetchUserInfo = async () => {
        try {
            const response = await fetch('/api/userinfo', {
                method: 'GET',
                headers: {
                    'Authorization': getToken(),
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('직원 정보를 가져오는데 실패했습니다.');
            }

            const userData = await response.json();

            // Redux 스토어 업데이트
            dispatch(setUserData(userData));
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    // 전화번호 변경 모달 닫기 함수
    const handleClosePhoneModal = async () => {
        if (newPhoneNumber) {
            try {
                const response = await fetch(`/api/employees/${employeeData.emp_no}/phone`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': getToken(),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ phone: newPhoneNumber }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                // 전화번호 업데이트가 성공하면 사용자 정보를 다시 가져오기
                await fetchUserInfo();

                alert('전화번호가 성공적으로 변경되었습니다.');
            } catch (error) {
                console.error('전화번호 업데이트 오류:', error);
                alert(`전화번호 변경 중 오류가 발생했습니다: ${error.message}`);
            }
        } else {
            alert('새로운 전화번호를 입력해주세요.');
        }

        setShowPhoneModal(false); // 모달 닫기
        setNewPhoneNumber('');
    };

    // 이메일 변경 모달 닫기 함수
    const handleCloseEmailModal = async () => {
        if (newPhoneNumber) {
            try {
                const response = await fetch(`/api/employees/${employeeData.emp_no}/phone`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': getToken(),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ phone: newPhoneNumber }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                // 전화번호 업데이트가 성공하면 사용자 정보를 다시 가져오기
                await fetchUserInfo();

                alert('전화번호가 성공적으로 변경되었습니다.');
            } catch (error) {
                console.error('전화번호 업데이트 오류:', error);
                alert(`전화번호 변경 중 오류가 발생했습니다: ${error.message}`);
            }
        } else {
            alert('새로운 전화번호를 입력해주세요.');
        }

        setShowEmailModal(false); // 모달 닫기
        setNewPhoneNumber('');
    };

    // 비밀번호 변경 모달 열기 함수
    const handleUserPwChangebtn = () => {
        setShowPwChangeModal(true); // 모달 열기
    };

    // 비밀번호 변경 모달 닫기 및 비밀번호 변경 함수
    const handleUserPwCloseModal = async () => {
        // 새 비밀번호와 확인 비밀번호가 일치하는지 확인
        if (newPassword !== confirmNewPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await fetch(`/api/employees/${employeeData.emp_no}/password`, {
                method: 'PUT',
                headers: {
                    'Authorization': getToken(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            alert('비밀번호가 성공적으로 변경되었습니다.');
            // 모달 닫기 및 입력 필드 초기화
            setShowPwChangeModal(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error('비밀번호 변경 오류:', error);
            alert(`비밀번호 변경 중 오류가 발생했습니다: ${error.message}`);
        }
    };

    // 현재 비밀번호 입력 핸들러
    const handleCurrentPasswordChange = (e) => {
        setCurrentPassword(e.target.value);
    };

    // 새 비밀번호 입력 핸들러
    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    // 새 비밀번호 확인 입력 핸들러
    const handleConfirmNewPasswordChange = (e) => {
        setConfirmNewPassword(e.target.value);
    };

    // 파일 선택 버튼 클릭 시 파일 입력 클릭
    const handleProfileImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // 프로필 이미지 변경 핸들러
    const handleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            // 파일 타입 및 크기 검증
            if (!file.type.startsWith('image/')) {
                alert('이미지 파일만 업로드할 수 있습니다.');
                return;
            }
            if (file.size > 20 * 1024 * 1024) { // 20MB 제한
                alert('파일 크기는 20MB를 초과할 수 없습니다.');
                return;
            }

            // FormData 생성
            const formData = new FormData();
            formData.append('profileImage', file);

            try {
                setIsUploading(true);
                // 프로필 이미지 업로드 요청
                const response = await fetch(`/api/employees/${employeeData.emp_no}/uploadProfileImage`, {
                    method: 'POST',
                    headers: {
                        'Authorization': getToken(),
                        // 'Content-Type'은 생략해야 합니다.
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                // 프로필 이미지 업로드 후 서버로부터 최신의 employeeData 받아오기
                await fetchUserInfo();

                alert('프로필 이미지가 성공적으로 변경되었습니다.');
            } catch (error) {
                console.error('프로필 이미지 업로드 오류:', error);
                alert('프로필 이미지 업로드 중 오류가 발생했습니다.');
            } finally {
                setIsUploading(false);
            }
        }
    };

    // 비밀번호 표시 토글 함수
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

    return (
        <div className="container-xl">
            <div className={styles.mypageContainer}>
                <div className={styles.mypageProfil}>
                    <div className={styles.profileImageContainer}>
                        <img src={employeeData.emp_profile} alt="Profile" className={styles.image} />
                        <div className={styles.cameraIcon} onClick={handleProfileImageClick} aria-label="프로필 이미지 변경">
                            <FontAwesomeIcon icon={faCamera} size="lg" />
                            {isUploading && <Spinner animation="border" size="sm" className={styles.spinner} />}
                        </div>
                        {/* 숨겨진 파일 입력 */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleProfileImageChange}
                        />
                    </div>

                    <div className={styles.profiltitle}>
                        {/* <p>{employeeInfo.dept_name} - {employeeInfo.dept_team_name}</p> 부서 정보 동적으로 표시 */}
                        <div className={styles.titlename}>
                            <div className={styles.userName}>{employeeData.emp_name}</div> {/* 이름 동적으로 표시 */}
                            <div className={styles.userGrade}>{userPosition}</div> {/* 직급 동적으로 표시 */}
                        </div>
                    </div>
                </div>
                <div className={styles.infoTable}>
                    <Table className={styles.userAnnualInfoTable}>
                        <tbody>
                            <tr>
                                <td className={styles.infotitle}>사 번</td>
                                <td className={styles.infoValue}>{employeeInfo.emp_no}</td>
                                <td className={styles.infotitle}>비밀번호</td>
                                <td className={styles.infoValue}><Button variant="primary" className={styles.userNumUpdatebtnInput} onClick={handleUserPwChangebtn}>변경</Button></td>
                            </tr>
                            <tr>
                                <td className={styles.infotitle}>부 서</td>
                                <td className={styles.infoValue}>{employeeInfo.dept_name}</td>
                                <td className={styles.infotitle}>팀</td>
                                <td className={styles.infoValue}>{employeeInfo.dept_team_name}</td>

                            </tr>
                            <tr>
                                <td className={styles.infotitle}>이 메 일</td>
                                <td className={styles.infoValue}><Button variant="primary" className={styles.userNumUpdatebtnInput} onClick={handleUserEmailUpdate}>수정</Button></td>
                                <td className={styles.infotitle}>전화번호</td>
                                <td className={styles.infoValue}><Button variant="primary" className={styles.userNumUpdatebtnInput} onClick={handleUsernumUpdate}>수정</Button></td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                <div className={styles.userAnnualInfobox}>
                    <div className={styles.tablebox}>
                        <Table className={styles.userAnnualInfoTable}>
                            <tbody>
                                <tr className={styles.tableHead}>
                                    <td colSpan={4}>단위: 개</td>
                                </tr>
                                <tr>
                                    <td className={styles.infotitle}>총 근무 기간</td>
                                    <td className={styles.infoValue}>{employeeData.emp_join_date ? `${formatDate(employeeData.emp_join_date)} ~ / ${calculateYearsAndMonths(employeeData.emp_join_date)} 근무 중` : '정보 없음'}</td>
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
            </div>

            {/* 전화번호 수정 모달 */}
            <Modal show={showPhoneModal} onHide={() => setShowPhoneModal(false)} centered className={styles.userNumModal}>
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
                    <Button variant="primary" onClick={handleClosePhoneModal} className={styles.userNumUpdatebtn}>
                        저장
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* 이메일 수정 모달 */}
            <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)} centered className={styles.userNumModal}>
                <Modal.Header closeButton>
                    <Modal.Title className={styles.modalTitle}>이메일 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modal_body}>
                    <Form className={styles.userEmail_form}>
                        <Form.Group controlId="userEmailAddr" className={styles.formEmailAddr}>
                            <Form.Label>기존 이메일 주소</Form.Label>
                            <Form.Control
                                type="text"
                                className={styles.modal_input}
                                value={emailAddr}
                                placeholder='abc@naver.com'
                                onChange={handlePhoneNumberChange}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmailAddr" className={styles.formEmailAddrNew}>
                            <Form.Label>새 이메일 주소</Form.Label>
                            <Form.Control
                                type="text"
                                className={styles.modal_input}
                                value={newEmailAddr}
                                onChange={handleNewPhoneNumberChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className={styles.modal_footer}>
                    <Button variant="primary" onClick={handleCloseEmailModal} className={styles.userEmailUpdatebtn}>
                        저장
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* 비밀번호 변경 모달 */}
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
                                    value={currentPassword}
                                    onChange={handleCurrentPasswordChange}
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
                                    value={confirmNewPassword}
                                    onChange={handleConfirmNewPasswordChange}
                                />
                                <Button variant="link" onClick={toggleShowConfirmPassword} className={styles.toggle_password} disabled={confirmNewPassword.length === 0}>
                                    <span className="material-icons">
                                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </Button>
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className={styles.modal_footer}>
                    <Button variant="primary" className={styles.userPwChangebtn} onClick={handleUserPwCloseModal}>
                        저장
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default CompanyUserMypage;
