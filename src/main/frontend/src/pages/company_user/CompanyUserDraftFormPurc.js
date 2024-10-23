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

  return (
    <div className="container">

    </div>
  );
};

export default CompanyUserDraftFormPurc;
