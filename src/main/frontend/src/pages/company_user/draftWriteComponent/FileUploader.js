import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../../../styles/company/company_draft_write_work.module.css';
import style from '../../../styles/draftWriteComponent/FileUploader.module.css';

const FileUploader = ({ files, handleDrop, handleDragOver, handleRemoveFile }) => (
  <div className={style.dropZone} onDrop={handleDrop} onDragOver={handleDragOver}>
        <p>파일을 여기에 드롭하거나 클릭하여 추가하세요 </p>
    <ul>
      {files.map((file, index) => (
        <li key={index}>
          {file.name}
          <Button variant="danger" size="sm" onClick={() => handleRemoveFile(index)}>삭제</Button>
        </li>
      ))}
    </ul>
  </div>
);

export default FileUploader;
