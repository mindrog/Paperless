import React, { useState, useRef } from 'react'
import { Table, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import styles from '../../styles/company/admin/company_member.module.css';
import Menubar from '../layout/menubar';
import OrgChart from '../layout/org_chart';

function CompanyAdminMember() {
    const [showAddModal, setShowAddModal] = useState(false); // 직원 추가 모달 상태
    const [showEditModal, setShowEditModal] = useState(false); // 직원 수정 모달 상태
    const [selectedEmployee, setSelectedEmployee] = useState(null); // 수정할 직원 정보
    const [position, setPosition] = useState(''); // 직급 상태 관리
    const orgChartRef = useRef(null); // orgChart 컴포넌트를 참조할 ref 생성
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

    const [employeeData, setEmployeeData] = useState([
        { id: 'PL1000', department: '경영지원', team: '경영지원팀', name: '이범상', email: 'beom@paperless.com', position: '사장' },
        { id: 'PL1001', department: '마케팅', team: '마케팅팀', name: '김다미', email: 'dami@paperless.com', position: '사원' },
        { id: 'PL1002', department: '마케팅', team: '마케팅팀', name: '이도현', email: 'dohyun@paperless.com', position: '주임' },
        { id: 'PL1003', department: '기획', team: '기획팀', name: '최수빈', email: 'subin@paperless.com', position: '과장' },
        { id: 'PL1004', department: '기획', team: '기획팀', name: '이유미', email: 'yumi@paperless.com', position: '차장' },
        { id: 'PL1005', department: '경영지원', team: '경영지원팀', name: '나인우', email: 'inwoo@paperless.com', position: '대리' },
        { id: 'PL1006', department: '경영지원', team: '경영지원팀', name: '박지훈', email: 'jihoon@paperless.com', position: '차장' },
        { id: 'PL1007', department: '기획', team: '기획팀', name: '임윤아', email: 'yoona@paperless.com', position: '과장' },
        { id: 'PL1008', department: '마케팅', team: '마케팅팀', name: '이성경', email: 'seong@paperless.com', position: '주임' },
        { id: 'PL1009', department: '기획', team: '기획팀', name: '정경호', email: 'kyungho@paperless.com', position: '대리' },
        { id: 'PL1010', department: '경영지원', team: '경영지원팀', name: '김지원', email: 'jiwon@paperless.com', position: '대리' },
    ]);


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

    const handleInputChange = (e, id, field) => {
        const newValue = e.target.value;
        setEmployeeData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, [field]: newValue } : item
            )
        );
    };

    // const handleUpdate = async (id) => {
    //     const updatedItem = employeeData.find((item) => item.id === id);
    //     console.log("Updated item:", updatedItem);

    //     try {
    //         const response = await fetch(`/api/updateMember/${id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(updatedItem),
    //         });

    //         // 통신 에러 발생 시
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await response.json();
    //         console.log("Server에서 받은 데이터 :", data);

    //         alert(`직원 ${id}이(가) 업데이트되었습니다.`);

    //     } catch (error) {
    //         console.error("Error updating item:", error);
    //         alert("업데이트 중 오류가 발생했습니다.");
    //     }
    // };

    // 모든 드롭다운을 닫는 함수
    const closeAllDropdowns = () => {
        if (orgChartRef.current) {
            orgChartRef.current.closeAllDropdowns(); // closeAllDropdowns 호출
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

            <div className={styles.content}>
                <div className={styles.formBox}>
                    <Form inline>
                        <Button variant="primary" className={styles.insertBtn} onClick={handleShowAddModal}>직원 추가</Button>
                        <Button variant="primary" className={styles.deleteBtn}>직원 삭제</Button>
                    </Form>

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
                </div>
                <Table bordered className={styles.contentTable}>
                    <thead>
                        <tr>
                            <th className={styles.productChartCol}>조직도</th>
                            <th className={styles.productListCol}>직원 목록</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th className={styles.productChartCol}>
                                <div className={styles.orgChartBox}>
                                    <div className={styles.dropdownCloseBtnBox}>
                                        <Button className={styles.dropdownCloseBtn} onClick={closeAllDropdowns}> 모두 닫기</Button>
                                    </div>
                                    <OrgChart className={styles.orgChart} ref={orgChartRef} />
                                </div>
                            </th>
                            <th className={styles.productListCol}>
                                <div className={styles.productTableBox}>
                                    <Table bordered className={styles.memberTable}>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input type='checkbox'
                                                        className={styles.inputCheckBox}
                                                        onChange={handleSelectAll}
                                                        checked={isAllSelected} />
                                                </th>
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
                                                        {/* <Button
                                                            variant="primary"
                                                            className={styles.updateBtn}
                                                            onClick={() => handleUpdate(employee.id)}
                                                        >
                                                            수정
                                                        </Button> */}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </th>
                        </tr>
                    </tbody>
                </Table>
                {/* content */}
            </div>

        </div>
    );
}

export default CompanyAdminMember;
