// 전체 문서함

import React, { useEffect, useState } from 'react';
import styles from '../../../styles/company/company_doc_list.module.css';
import '../../../styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DocumentList from '../../component/DocumentList';
import Toolbar from '../../component/Toolbar';
import Pagination from '../../component/Pagination';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CompanyUserDraftDocAll() {
    const navigate = useNavigate();
    const [docs, setDocs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const docsPerPage = 10; // 페이지 당 문서 수

    // 테이블 열 정의
    const completedColumns = [
        { key: 'no', label: 'no', width: '10%' },
        { key: 'repo_code', label: '문서코드', width: '20%' },
        { key: 'reportTitle', label: '제목', width: '30%' },
        { key: 'emp_name', label: '작성자', width: '20%' },
        { key: 'reportStatus', label: '상태', width: '20%' },
        { key: 'submission_date', label: '작성일', width: '20%' }
    ];

    // 문서 목록 가져오기 - API 호출
    useEffect(() => {
        const fetchdocRequest = async () => {
            try {
                const token = localStorage.getItem('jwt'); // 토큰 가져오기
                if (!token) {
                    console.error("토큰이 없습니다.");
                    return;
                }
                const response = await axios.get('http://localhost:8080/api/getreportlist', {
                    headers: {
                        'Authorization': token
                    }
                });

                // 응답 데이터를 배열로 변환하여 상태에 설정
                setDocs(Object.values(response.data));
                console.log("Raw response data:", response.data);
            } catch (error) {
                console.error('호출이 실패 했습니다 :', error);
            }
        };
        fetchdocRequest();
    }, []);

    // 페이지네이션 계산
    const indexOfLastDoc = currentPage * docsPerPage;  // 마지막 문서 인덱스 계산
    const indexOfFirstDoc = indexOfLastDoc - docsPerPage; // 첫 문서 인덱스 계산

    // 현재 페이지에 해당하는 문서 목록 (docs가 undefined일 때 빈 배열로 처리)
    const currentDocs = docs ? docs.slice(indexOfFirstDoc, indexOfLastDoc) : [];

    // 총 페이지 수 계산 (docs가 undefined일 때 기본값 1로 설정)
    const totalPages = docs ? Math.ceil(docs.length / docsPerPage) : 1;

    // 정렬 옵션 상태
    const [sortOption, setSortOption] = useState('dateDesc');

    // 정렬 옵션 변경 핸들러
    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortOption(value);

        // 현재 정렬 옵션에 따라 문서 목록 정렬
        let sortedDocs = [...docs];

        if (value === 'dateDesc') {
            sortedDocs.sort((a, b) => new Date(b.submission_date) - new Date(a.submission_date));
        } else if (value === 'dateAsc') {
            sortedDocs.sort((a, b) => new Date(a.submission_date) - new Date(b.submission_date));
        } else if (value === 'titleAsc') {
            sortedDocs.sort((a, b) => a.reportTitle.localeCompare(b.reportTitle));
        } else if (value === 'titleDesc') {
            sortedDocs.sort((a, b) => b.reportTitle.localeCompare(a.reportTitle));
        }

        setDocs(sortedDocs); // 정렬된 결과로 문서 목록 업데이트
        setCurrentPage(1); // 정렬 변경 시 첫 페이지로 이동
    };

    // 검색 상태와 핸들러
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchTermChange = (value) => {
        setSearchTerm(value);
    };

    const handleSearch = () => {
        // 검색어에 따라 문서 목록 필터링
        const filteredDocs = docs.filter((doc) =>
            doc.reportTitle.includes(searchTerm) || doc.emp_name.includes(searchTerm)
        );
        setDocs(filteredDocs); // 필터링된 결과로 문서 목록 업데이트
        setCurrentPage(1); // 검색 후 첫 페이지로 이동
    };

    // 행 클릭 시 문서 상세 페이지로 이동
    const handleRowClick = (reportId) => {
        navigate(`/company/user/draft/detail/work/${reportId}`);
    };

    return (
        <div className="container">
            <h2 className={styles.pageTitle}>전체 문서함</h2>
            <div className={styles.Container}>

                {/* 정렬 및 검색을 위한 툴바 컴포넌트 */}
                <Toolbar
                    sortOption={sortOption}
                    onSortChange={handleSortChange}
                    searchTerm={searchTerm}
                    onSearchTermChange={handleSearchTermChange}
                    onSearch={handleSearch}
                />

                {/* 문서 리스트 컴포넌트 */}
                <DocumentList docs={currentDocs} onRowClick={handleRowClick} columns={completedColumns}/>

                {/* 페이지네이션 컴포넌트 */}
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

export default CompanyUserDraftDocAll;
