import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../../../styles/company/FileUploader.module.css'; 

const FileUploader = ({ files, setFiles }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div
      className={styles.dropZone}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('fileInput').click()}
    >
      <input
        id="fileInput"
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <p>파일을 여기에 드롭하거나 클릭하여 추가하세요</p>

      <ul>
        {files.map((file, index) => (
          <li key={index} className={styles.fileItem}>
            📄 {file.name}
            <Button variant="danger" size="sm" onClick={() => handleRemoveFile(index)}>삭제</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUploader;
