import React, { useState } from 'react';
import { Table, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import styles from '../../styles/company/admin/company_member.module.css';
import Menubar from '../layout/menubar';

function CompanyAdminMember() {
    const [showAddModal, setShowAddModal] = useState(false); // 직원 추가 모달 상태
    const [showEditModal, setShowEditModal] = useState(false); // 직원 수정 모달 상태
    const [selectedEmployee, setSelectedEmployee] = useState(null); // 수정할 직원 정보
    const [position, setPosition] = useState(''); // 직급 상태 관리

    const [searchCategory, setSearchCategory] = useState('name'); // 검색 카테고리 선택 상태

    // 검색 카테고리 변경 핸들러
    const handleCategoryChange = (e) => {
        setSearchCategory(e.target.value);
    };
    // 직원 전체 선택 체크박스 상태 관리
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState([]); // 선택된 직원 목록
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // 검색 로직 처리
        console.log(`Search by: ${searchCategory}`);
    };

    // 직원 추가 모달 열기/닫기
    const handleShowAddModal = () => setShowAddModal(true);
    const handleCloseAddModal = () => setShowAddModal(false);

    // 직원 수정 모달 열기/닫기
    const handleShowEditModal = (employee) => {
        setSelectedEmployee(employee); // 선택된 직원 정보 저장
        setPosition(employee.position); // 기존 직급을 선택된 값으로 설정
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => setShowEditModal(false);

    // 직원 추가/수정 폼 처리
    const handleFormSubmit = (e) => {
        e.preventDefault();
        // 직원 추가 또는 수정 로직 처리
        handleCloseAddModal();
        handleCloseEditModal();
    };

    const employeeData = [
        { id: 1, department: "Mark", team: "Mark", name: "Otto", email: "@mdo", position: "대리" },
        { id: 2, department: "Jacob", team: "Mark", name: "Thornton", email: "@fat", position: "과장" }
    ];

    const positionOptions = [
        '사원', '주임', '대리', '과장', '차장', '부장', '이사', '상무', '전무', '부사장', '사장'
    ];

    // 전체 선택 체크박스 클릭 핸들러
    const handleSelectAll = () => {
        if (!isAllSelected) {
            // 전체 체크박스를 선택하면 모든 직원 선택
            setSelectedEmployees(employeeData.map(employee => employee.id));
        } else {
            // 전체 체크박스가 해제되면 모든 직원 선택 해제
            setSelectedEmployees([]);
        }
        setIsAllSelected(!isAllSelected);
    };

    // 개별 체크박스 클릭 핸들러
    const handleEmployeeSelect = (id) => {
        if (selectedEmployees.includes(id)) {
            setSelectedEmployees(selectedEmployees.filter(empId => empId !== id)); // 이미 선택된 경우 해제
        } else {
            setSelectedEmployees([...selectedEmployees, id]); // 선택되지 않은 경우 추가
        }
    };

    return (
        <div className="container-xl">
            <Menubar />

            <div className={styles.titleBox}>
                <div className={styles.title}>
                    <h1 className={styles.pageTitle}>직원 관리</h1>
                    <p className={styles.memberCount}>🧑‍💼 10</p>
                </div>
            </div>
            <Table className={styles.memberTable}>
                <thead>
                    <tr className={styles.headBox}>
                        <th>
                            <input type='checkbox'
                                className={styles.inputCheckBox}
                                onChange={handleSelectAll}
                                checked={isAllSelected} />
                        </th>
                        <th className={styles.optionBox}>
                            <Form inline>
                                <Button variant="primary" className={styles.insertBtn} onClick={handleShowAddModal}>직원 추가</Button>
                                <Button variant="primary" className={styles.deleteBtn}>직원 삭제</Button>
                            </Form>
                        </th>
                        <th colSpan={5}>
                            <Form inline className={styles.sreachFormBox} onSubmit={handleSearchSubmit}>
                                <Row>
                                    <Col xs="auto">
                                        {/* 검색 카테고리 드롭다운 */}
                                        <Form.Select
                                            value={searchCategory}
                                            onChange={handleCategoryChange}
                                            className={styles.searchSelect}
                                        >
                                            <option value="name">직원명</option>
                                            <option value="email">이메일</option>
                                            <option value="department">소속 본부</option>
                                            <option value="position">직급</option>
                                        </Form.Select>
                                    </Col>
                                    <Col xs="auto">
                                        <Form.Control
                                            type="text"
                                            placeholder="Search"
                                            className="mr-sm-2"
                                        />
                                    </Col>
                                    <Col xs="auto">
                                        <Button type="submit" className={styles.sreachBtn}>검색</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </th>
                    </tr>
                    <tr>
                        <th>#</th>
                        <th>소속 본부</th>
                        <th>소속 부서</th>
                        <th>직원명</th>
                        <th className={styles.userEmail}>이메일</th>
                        <th>직급</th>
                        <th className={styles.updateBtnCol}></th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {employeeData.map((employee) => (
                        <tr key={employee.id}>
                            <th><input
                                    type='checkbox'
                                    checked={selectedEmployees.includes(employee.id)}
                                    onChange={() => handleEmployeeSelect(employee.id)}
                                />
                            </th>
                            <td>{employee.department}</td>
                            <td>{employee.team}</td>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.position}</td>
                            <td>
                                <Button
                                    variant="primary"
                                    className={styles.updateBtn}
                                    onClick={() => handleShowEditModal(employee)}
                                >
                                    수정
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* 직원 추가 모달 */}
            <Modal show={showAddModal} onHide={handleCloseAddModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>직원 추가</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="formDepartment" className={styles.formContext}>
                            <Form.Label className={styles.formLabel}>소속 본부</Form.Label>
                            <Form.Control type="text" placeholder="소속 본부" className={styles.formValue} required />
                        </Form.Group>
                        <Form.Group controlId="formTeam" className={styles.formContext}>
                            <Form.Label className={styles.formLabel}>소속 부서</Form.Label>
                            <Form.Control type="text" placeholder="소속 부서" className={styles.formValue} required />
                        </Form.Group>
                        <Form.Group controlId="formName" className={styles.formContext}>
                            <Form.Label className={styles.formLabel}>직원명</Form.Label>
                            <Form.Control type="text" placeholder="직원명" className={styles.formValue} required />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className={styles.formContext}>
                            <Form.Label className={styles.formLabel}>이메일</Form.Label>
                            <Form.Control type="email" placeholder="이메일" className={styles.formValue} required />
                        </Form.Group>
                        <Form.Group controlId="formPosition" className={styles.formContext}>
                            <Form.Label className={styles.formLabel}>직급</Form.Label>
                            <Form.Select required className={styles.formValue}>
                                {positionOptions.map((position, idx) => (
                                    <option key={idx} value={position}>{position}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <div className={styles.FormSubmitBtn}>
                            <Button variant="primary" type="submit" className={styles.saveBtn}>
                                저장
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* 직원 수정 모달 */}
            <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>직원 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="formDepartment" className={styles.formContext}>
                            <Form.Label className={styles.formLabel}>소속 본부</Form.Label>
                            <Form.Control type="text" className={styles.formValue} defaultValue={selectedEmployee?.department} required />
                        </Form.Group>
                        <Form.Group controlId="formTeam" className={styles.formContext}>
                            <Form.Label className={styles.formLabel}>소속 부서</Form.Label>
                            <Form.Control type="text" className={styles.formValue} defaultValue={selectedEmployee?.team} required />
                        </Form.Group>
                        <Form.Group controlId="formName" className={styles.formContext}>
                            <Form.Label className={styles.formLabel}>직원명</Form.Label>
                            <Form.Control type="text" className={styles.formValue} defaultValue={selectedEmployee?.name} required />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className={styles.formContext}>
                            <Form.Label className={styles.formLabel}>이메일</Form.Label>
                            <Form.Control type="email" className={styles.formValue} defaultValue={selectedEmployee?.email} required />
                        </Form.Group>
                        <Form.Group controlId="formPosition" className={styles.formContext}>
                            <Form.Label className={styles.formLabel}>직급</Form.Label>
                            <Form.Select defaultValue={selectedEmployee?.position} className={styles.formValue} required>
                                {positionOptions.map((position, idx) => (
                                    <option key={idx} value={position}>{position}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <div className={styles.FormSubmitBtn}>
                            <Button variant="primary" type="submit" className={styles.saveBtn}>
                                저장
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default CompanyAdminMember;
