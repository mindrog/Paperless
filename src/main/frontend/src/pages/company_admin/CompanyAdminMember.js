import React, { useState, useRef,useEffect } from 'react'
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
import styles from '../../styles/company/admin/company_member.module.css';
import '../../styles/company/admin_member.css';
import Menubar from '../layout/menubar';
import OrgChart from '../layout/org_chart';
import axios from 'axios';

function CompanyAdminMember() {
    const [showAddModal, setShowAddModal] = useState(false); // 직원 추가 모달 상태
    const [showEditModal, setShowEditModal] = useState(false); // 직원 수정 모달 상태
    const [employee, setemployee] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null); // 수정할 직원 정보
    const [position, setPosition] = useState(''); // 직급 상태 관리
    const orgChartRef = useRef(null); // orgChart 컴포넌트를 참조할 ref 생성
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [companyNumber, setCompanyNumber] = useState('');
    const [departmentNumber, setDepartmentNumber] = useState('');
    const [department, setDepartment] = useState('');
    const [team, setTeam] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [departments, setDepartments] = useState([]);
    const [teams, setTeams] = useState([]);
    const [positions, setPositions] = useState([]);

    const [searchCategory, setSearchCategory] = useState("name");
    const [searchQuery, setSearchQuery] = useState("");

// 카테고리 변경 시 상태 업데이트
const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
};

// 검색어 입력 시 상태 업데이트
const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
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
    useEffect(() => {
        const getemps = async () => {
            
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {

                    console.error("토큰이 없습니다.");
                    return;
                }
                const response = await axios.get(`http://localhost:8080/api/getemps?emp_comp_no=${userData.emp_comp_no}`, {
                    headers: {
                        'Authorization': token
                    }
                });

                setemployee(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('호출이 실패 했습니다 :', error);
            }
        };
        console.log()
        getemps();
    }, []);
    useEffect(() => {
        const fetchDepartments = async () => {
            
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {

                    console.error("토큰이 없습니다.");
                    return;
                }
                const response = await axios.get('http://localhost:8080/api/getdeptnamelist', {
                    headers: {
                        'Authorization': token
                    }
                });

                setDepartments(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('호출이 실패 했습니다 :', error);
            }
        };
        console.log()
        fetchDepartments(departments);
    }, []);
    useEffect(() => {
        const fetchTeam = async () => {
            if (department) {
                console.log('department : ' + department);
                try {
                    const token = localStorage.getItem('jwt');
                    if (!token) {
                        console.error("토큰이 없습니다.");
                        return;
                    }
                    const response = await axios.get(`http://localhost:8080/api/getteamname?dept_name=${department}`, {
                        headers: {
                            'Authorization': token
                        }
                    });
    
                    setTeams(response.data);
                    console.log(response.data);
                } catch (error) {
                    console.error('호출이 실패 했습니다 :', error);
                }
            } else {
                console.error('department 없음');
            }
        };
    
        fetchTeam(); // useEffect가 실행될 때 fetchTeam 호출
    }, [department]);
    useEffect(() => {
        const fetchDeptNo = async () => {
            if (team && department) {
                console.log('team : ' + team + "Department : " + department);
                try {
                    const token = localStorage.getItem('jwt');
                    if (!token) {
                        console.error("토큰이 없습니다.");
                        return;
                    }
                    const response = await axios.get(`http://localhost:8080/api/getdeptno?dept_name=${department}&dept_team_name=${team}`, {
                        headers: {
                            'Authorization': token
                        }
                    });
    
                    setDepartmentNumber(response.data);
                    console.log(response.data);
                } catch (error) {
                    console.error('호출이 실패 했습니다 :', error);
                }
            } else {
                console.error('department 없음');
            }
        };
    
        fetchDeptNo(); 
    }, [team]);
    useEffect(() => {
        const fetchPosition = async () => {
            
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {

                    console.error("토큰이 없습니다.");
                    return;
                }
                const response = await axios.get('http://localhost:8080/api/getposi', {
                    headers: {
                        'Authorization': token
                    }
                });

                setPositions(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('호출이 실패 했습니다 :', error);
            }
        };
        console.log()
        fetchPosition();
    }, []);
    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/empsearch`, {
                params: {
                    category: searchCategory,
                    query: searchQuery,
                },
            });
            // 검색 결과 처리
            setemployee(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("검색 요청 실패:", error);
        }
    };
    const handleDeleteSelectedEmployees = async () => {
        if (selectedEmployees.length === 0) {
            alert("삭제할 직원을 선택하세요.");
            return;
        }
    
        try {
            const token = localStorage.getItem('jwt');
            if (!token) {
                console.error("토큰이 없습니다.");
                return;
            }
    
            // 선택된 직원 번호 배열을 서버에 전달하여 삭제 요청
            const response = await axios.post('http://localhost:8080/api/deleteemployees', selectedEmployees, {
                headers: {
                    'Authorization': token
                }
            });
    
            // 성공적으로 삭제된 경우
            alert("선택된 직원이 삭제되었습니다.");
            setemployee(employee.filter(emp => !selectedEmployees.includes(emp.emp_no))); // 삭제된 직원 리스트 갱신
            setSelectedEmployees([]); // 선택 초기화
           setIsAllSelected(false); // 전체 선택 초기화
        } catch (error) {
            console.error("직원 삭제 실패:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };
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

    const handleUpdate = async (id) => {
        const updatedItem = employeeData.find((item) => item.id === id);
        console.log("Updated item:", updatedItem);

        try {
            const response = await fetch(`/api/updateMember/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });

            // 통신 에러 발생 시
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log("Server에서 받은 데이터 :", data);

            alert(`직원 ${id}이(가) 업데이트되었습니다.`);

        } catch (error) {
            console.error("Error updating item:", error);
            alert("업데이트 중 오류가 발생했습니다.");
        }
    };
    
    // 모든 드롭다운을 닫는 함수
    const closeAllDropdowns = () => {
        if (orgChartRef.current) {
            orgChartRef.current.closeAllDropdowns(); // closeAllDropdowns 호출
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const empData ={
            emp_code: id,
            emp_name: name,
            emp_pw: password,
            emp_comp_no: userData.emp_comp_no,
            emp_dept_no: departmentNumber,
            emp_posi_no:position,
            emp_email:email,
            emp_phone:contact
        }
        try {
            const token = localStorage.getItem('jwt');
            if (!token) {
                console.error("토큰이 없습니다.");
                return;
            }
    
            const response = await axios.post('http://localhost:8080/api/userinsert', empData, {
                headers: {
                    'Authorization': token
                }
            });
    
            console.log("직원 추가 성공:", response.data);
            alert("직원이 성공적으로 추가되었습니다.");
            handleCloseAddModal(); // 모달 닫기
        } catch (error) {
            console.error("직원 추가 실패:", error);
            alert("직원 추가 중 오류가 발생했습니다.");
        }
    };
   
    const userData = useSelector((state) => state.user.data);
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
                        <Button variant="primary" className={styles.deleteBtn} onClick={handleDeleteSelectedEmployees}>직원 삭제</Button>
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
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button type="submit" className={styles.sreachBtn} onClick={handleSearch}>검색</Button>
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
                                                <th>소속 부서</th>
                                                <th>소속 팀</th>
                                                <th>직원명</th>
                                                <th className={styles.userEmail}>이메일</th>
                                                <th>직급</th>
                                                <th className={styles.updateBtnCol}></th>
                                            </tr>
                                        </thead>
                                        <tbody className={styles.tableBody}>
                                            {employee.map((employee) => (
                                                <tr key={employee.id}>
                                                    <th><input
                                                        type='checkbox'
                                                        checked={selectedEmployees.includes(employee.emp_no)}
                                                        onChange={() => handleEmployeeSelect(employee.emp_no)}
                                                    />
                                                    </th>
                                                    <td>{employee.dept_name}</td>
                                                    <td>{employee.dept_team_name}</td>
                                                    <td>{employee.emp_name}</td>
                                                    <td>{employee.emp_email}</td>
                                                    <td>{employee.posi_name}</td>
                                                    <td>
                                                        <Button
                                                            variant="primary"
                                                            className={styles.updateBtn}
                                                            onClick={() => handleUpdate(employee.id)}
                                                        >
                                                            수정
                                                        </Button>
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
                

            </div>
            <Modal
                    isOpen={showAddModal}
                    onRequestClose={handleCloseAddModal}
                    contentLabel="직원 추가 모달"
                    className="addEmpModal"
                    
                >
                <div className="addEmpFormModal">
                    <h2>직원 추가</h2>
                    <form onSubmit={handleSubmit} className='addEmpForm'>
                        <div className='inputarea'>
                        <label>이름:</label> <input type="text" value={name} onChange={e => setName(e.target.value)} />
                        </div><div className='inputarea'>
                        <label>아이디:</label> <input type="text" value={id} onChange={e => setId(e.target.value)} />
                        </div><div className='inputarea'>
                        <label>비밀번호:</label> <input type="password" value={password} onChange={e => setPassword(e.target.value)} className='passwordinput' />
                        </div><div className='inputarea'>
                        <label>회사 번호: </label>
                        <input type="text" value={userData.emp_comp_no} disabled />
                        </div><div className='inputarea'>
                        <label>부서 번호:</label> <input type="text" value={departmentNumber} disabled />
                        </div><div className='inputarea'>                
                        <label>부서:</label>
                            <select value={department} onChange={e => setDepartment(e.target.value)}>
                                <option value="">부서를 선택하세요</option>
                                {departments.map(dept => (
                                    <option key={dept.dept_name} value={dept}>{dept}</option>
                                ))}
                            </select>
                        
                        </div><div className='inputarea'>
                        <label>팀:</label>
                            <select value={team} onChange={e => setTeam(e.target.value)}>
                                <option value="">팀을 선택하세요</option>
                                {teams.map(team => (
                                    <option key={team.dept_team_name} value={team}>{team}</option>
                                ))}
                            </select>
                        
                        </div><div className='inputarea'>
                        <label>직급:</label>
                            <select value={position} onChange={e => setPosition(e.target.value)}>
                                <option value="">직급을 선택하세요</option>
                                {positions.map(pos => (
                                    <option key={pos.posi_name} value={pos.posi_no}>{pos.posi_name}</option>
                                ))}
                            </select>
                        
                        </div><div className='inputarea'>
                        <label>이메일:</label> <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                        </div><div className='inputarea'>
                        <label>연락처:</label> <input type="text" value={contact} onChange={e => setContact(e.target.value)} />
                        </div>
                        <div className='inputarea'>
                        <Button variant="primary" type="submit" className={styles.userPwChangebtn}>
                            저장
                        </Button>
                        <Button variant="secondary" onClick={handleCloseAddModal}>닫기</Button>
                        </div>
                    </form>
                    </div>
                </Modal>
        </div>
        
    );
}

export default CompanyAdminMember;
