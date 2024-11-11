// 내 문서함

import React, { useEffect, useState } from 'react';
import styles from '../../../styles/company/company_doc_list.module.css';
import '../../../styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DocumentList from '../../component/DocumentList';
import Toolbar from '../../component/Toolbar';
import Pagination from '../../component/Pagination';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CompanyUserDraftDocMyuser() {
    const navigate = useNavigate();
    const [docs, setDocs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const docsPerPage = 10; // 페이지 당 문서 수

    // 테이블 열 정의
    const completedColumns = [
        { key: 'no', label: 'No', width: '5%' },
        { key: 'repo_code', label: '문서 번호', width: '15%' },
        { key: 'reportTitle', label: '문서 제목', width: '20%' },
        { key: 'emp_name', label: '기안자', width: '10%' },
        { key: 'submission_date', label: '기안일', width: '10%' },
        { key: 'reportStatus', label: '결재 상태', width: '10%' },
    ];

    // 문서 목록 가져오기 - API 호출
    useEffect(() => {
        const fetchDocRequest = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    console.error("토큰이 없습니다.");
                    return;
                }
                const response = await axios.get('http://localhost:8080/api/getmydoclist', {
                    headers: {
                        'Authorization': token
                    }
                });
                setDocs(Object.values(response.data)); 
                console.log("Raw response data:", response.data);
            } catch (error) {
                console.error('호출이 실패 했습니다 :', error);
            }
        };
        fetchDocRequest();
    }, []);

    // 페이지네이션 계산
    const indexOfLastDoc = currentPage * docsPerPage;
    const indexOfFirstDoc = indexOfLastDoc - docsPerPage;
    const currentDocs = docs ? docs.slice(indexOfFirstDoc, indexOfLastDoc) : [];

    const totalPages = docs ? Math.ceil(docs.length / docsPerPage) : 1;

    // 정렬 옵션 상태
    const [sortOption, setSortOption] = useState('dateDesc');

    // 정렬 옵션 변경 핸들러
    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortOption(value);

        let sortedDocs = [...docs];

        if (value === 'dateDesc') {
            sortedDocs.sort((a, b) => new Date(b.draftDate) - new Date(a.draftDate));
        } else if (value === 'dateAsc') {
            sortedDocs.sort((a, b) => new Date(a.draftDate) - new Date(b.draftDate));
        } else if (value === 'titleAsc') {
            sortedDocs.sort((a, b) => a.title.localeCompare(b.title));
        } else if (value === 'titleDesc') {
            sortedDocs.sort((a, b) => b.title.localeCompare(a.title));
        }

        setDocs(sortedDocs);
        setCurrentPage(1);
    };

    // 검색 상태와 핸들러
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchTermChange = (value) => {
        setSearchTerm(value);
    };

    const handleSearch = () => {
        const filteredDocs = docs.filter((doc) =>
            doc.title.includes(searchTerm) || doc.drafter.includes(searchTerm)
        );
        setDocs(filteredDocs);
        setCurrentPage(1);
    };

    // 행 클릭 시 문서 상세 페이지로 이동
    const handleRowClick = (reportId) => {
        navigate(`/company/user/draft/detail/work/${reportId}`);
    };

    return (
        <div className="container">
            <h2 className={styles.pageTitle}>내 문서함</h2>
            <div className={styles.Container}>
                <Toolbar
                    sortOption={sortOption}
                    onSortChange={handleSortChange}
                    searchTerm={searchTerm}
                    onSearchTermChange={handleSearchTermChange}
                    onSearch={handleSearch}
                />

                <DocumentList docs={currentDocs} onRowClick={handleRowClick} columns={completedColumns} />

                <div className={styles.pagenaition}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
}

export default CompanyUserDraftDocMyuser;
