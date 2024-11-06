import React, { useState } from 'react';
import styles from '../../styles/company/company_doc_list.module.css';
import '../../styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DocumentList from '../component/DocumentList';
import Toolbar from '../component/Toolbar';
import Pagination from '../component/Pagination';
import { useNavigate } from 'react-router-dom';

function CompanyUserDraftDocAll() {
    const navigate = useNavigate();
    const completedColumns = [
      { key: 'no', label: 'No', width: '5%' },
      { key: 'docNumber', label: '문서 번호', width: '10%' },
      { key: 'docType', label: '문서 양식', width: '10%' },
      { key: 'title', label: '문서 제목', width: '30%' },
      { key: 'drafter', label: '기안자', width: '15%' },
      { key: 'draftDate', label: '기안일', width: '15%' },
      { key: 'status', label: '결재 상태', width: '10%' },
    ];
  
    // 임의의 문서 데이터 생성
    const generateDocs = () => {
      const docList = [];
      for (let i = 1; i <= 35; i++) {
        docList.push({
          id: i,
          docNumber: `DOC-${1000 + i}`,
          docType: `양식 ${i % 5 + 1}`,
          title: `문서 제목 ${i}`,
          drafter: `사용자 ${i}`,
          draftDate: `2024-10-${String(i).padStart(2, '0')}`,
          status: i % 3 === 0 ? '승인' : i % 3 === 1 ? '진행 중' : '반려',
        });
      }
      return docList;
    };
  
    const [docs, setDocs] = useState(() => generateDocs());
  
    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const docsPerPage = 10;
  
    // 현재 페이지의 문서 가져오기
    const indexOfLastDoc = currentPage * docsPerPage;
    const indexOfFirstDoc = indexOfLastDoc - docsPerPage;
    const currentDocs = docs.slice(indexOfFirstDoc, indexOfLastDoc);
  
    // 총 페이지 수 계산
    const totalPages = Math.ceil(docs.length / docsPerPage);
  
    // 정렬 방식 상태
    const [sortOption, setSortOption] = useState('dateDesc');
  
    // 정렬 방식 변경 핸들러
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
      setCurrentPage(1); // 정렬 변경 시 첫 페이지로 이동
    };
  
    // 검색 상태 및 핸들러
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleSearchTermChange = (value) => {
      setSearchTerm(value);
    };
  
    const handleSearch = () => {
      // 검색어에 따라 문서 필터링
      const filteredDocs = generateDocs().filter((doc) =>
        doc.title.includes(searchTerm) || doc.drafter.includes(searchTerm)
      );
      setDocs(filteredDocs);
      setCurrentPage(1);
    };
  
    // 행 클릭 시 처리 함수
    const handleRowClick = (reportId) => {
      navigate(`/company/user/draft/approval/detail/work/${reportId}`);
    };
  
    return (
      <div className={styles.Container}>
        {/* 툴바 컴포넌트 사용 */}
        <Toolbar
          sortOption={sortOption}
          onSortChange={handleSortChange}
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          onSearch={handleSearch}
        />
  
        {/* 문서 리스트 컴포넌트 사용 */}
        <DocumentList docs={currentDocs} onRowClick={handleRowClick} columns={completedColumns} />
  
        {/* 페이지네이션 컴포넌트 사용 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className={styles.pagenaition}
        />
      </div>
    );
  }
  

export default CompanyUserDraftDocAll;
