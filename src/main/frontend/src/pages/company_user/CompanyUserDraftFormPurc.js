import React, { useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap'; 

const CompanyUserDraftFormPurc = () => {
  const [reportTitle, setReportTitle] = useState('');
  const [reporter, setReporter] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [department, setDepartment] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [formErrors, setFormErrors] = useState({}); // formErrors 상태 정의
  const [productRows, setProductRows] = useState([{ productName: '', specification: '', quantity: 0, unitPrice: 0, totalPrice: 0, note: '' }]); // productRows 정의
  const [files, setFiles] = useState([]); // files 배열 정의

  const handleAddRow = () => {
    setProductRows([...productRows, { productName: '', specification: '', quantity: 0, unitPrice: 0, totalPrice: 0, note: '' }]);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = productRows.filter((_, idx) => idx !== index);
    setProductRows(updatedRows);
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...productRows];
    updatedRows[index][field] = value;
    setProductRows(updatedRows);
  };

  const handleApprLineModal = () => {
    console.log("결재선 모달 열기");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, idx) => idx !== index);
    setFiles(updatedFiles);
  };

  return (
    <div className="container">
      {/* 생략된 코드 */}
    </div>
  );
};

export default CompanyUserDraftFormPurc;
