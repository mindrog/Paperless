// 구매 기안 작성
import React, { useState } from 'react';
import styles from '../../styles/company/company_draft_write_work.module.css';

const CompanyUserDraftwritePurc = () => {
  const [draftDept, setDraftDept] = useState('');
  const [supplier, setSupplier] = useState('');
  const [draftDate, setDraftDate] = useState('');
  const [projectNo, setProjectNo] = useState('');
  const [tel, setTel] = useState('');
  const [fax, setFax] = useState('');
  const [deliveryPlace, setDeliveryPlace] = useState('');
  const [usePurpose, setUsePurpose] = useState('');
  const [desiredDeliveryDate, setDesiredDeliveryDate] = useState('');
  const [items, setItems] = useState([{ id: 1, productCode: '', productName: '', specification: '', quantity: '', price: '', amount: '' }]);
  const [reason, setReason] = useState('');
  const [specialNote, setSpecialNote] = useState('');
  const [attachedDocs, setAttachedDocs] = useState('견적서');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      draftDept,
      supplier,
      draftDate,
      projectNo,
      tel,
      fax,
      deliveryPlace,
      usePurpose,
      desiredDeliveryDate,
      items,
      reason,
      specialNote,
      attachedDocs,
      additionalInfo
    };
    console.log('Form Data: ', formData);
  };

  const handleAddItem = () => {
    const newItem = { id: items.length + 1, productCode: '', productName: '', specification: '', quantity: '', price: '', amount: '' };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
  };

  return (
    <div className={styles.container}>
      <h1>구매 품의서</h1>
      <form onSubmit={handleSubmit}>
        <table className={styles.draftTable}>
          <tbody>
            <tr>
              <td>기안부서</td>
              <td>
                <input
                  type="text"
                  value={draftDept}
                  onChange={(e) => setDraftDept(e.target.value)}
                  required
                  className={styles.inputField}
                />
              </td>
              <td>납품자</td>
              <td colSpan="2">
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  required
                  className={styles.inputField}
                />
              </td>
              <td>작성 일자</td>
              <td colSpan="2">
                <input
                  type="date"
                  value={draftDate}
                  onChange={(e) => setDraftDate(e.target.value)}
                  required
                  className={styles.inputField}
                />
              </td>
            </tr>
            <tr>
              <td>프로젝트 번호</td>
              <td>
                <input
                  type="text"
                  value={projectNo}
                  onChange={(e) => setProjectNo(e.target.value)}
                  className={styles.inputField}
                />
              </td>
              <td>TEL</td>
              <td colSpan="2">
                <input
                  type="text"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  className={styles.inputField}
                />
              </td>
              <td>인도 장소</td>
              <td colSpan="2">
                <input
                  type="text"
                  value={deliveryPlace}
                  onChange={(e) => setDeliveryPlace(e.target.value)}
                  className={styles.inputField}
                />
              </td>
            </tr>
            <tr>
              <td>사용 목적</td>
              <td>
                <input
                  type="text"
                  value={usePurpose}
                  onChange={(e) => setUsePurpose(e.target.value)}
                  className={styles.inputField}
                />
              </td>
              <td>FAX</td>
              <td colSpan="2">
                <input
                  type="text"
                  value={fax}
                  onChange={(e) => setFax(e.target.value)}
                  className={styles.inputField}
                />
              </td>
              <td>희망 납기 일자</td>
              <td colSpan="2">
                <input
                  type="date"
                  value={desiredDeliveryDate}
                  onChange={(e) => setDesiredDeliveryDate(e.target.value)}
                  className={styles.inputField}
                />
              </td>
            </tr>
            <tr>
              <td>품번</td>
              <td>품명</td>
              <td>규격</td>
              <td>수량</td>
              <td>단가</td>
              <td>금액</td>
              <td>비고</td>
            </tr>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>
                  <input
                    type="text"
                    value={item.productCode}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index].productCode = e.target.value;
                      setItems(updatedItems);
                    }}
                    className={styles.inputField}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.productName}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index].productName = e.target.value;
                      setItems(updatedItems);
                    }}
                    className={styles.inputField}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.specification}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index].specification = e.target.value;
                      setItems(updatedItems);
                    }}
                    className={styles.inputField}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index].quantity = e.target.value;
                      setItems(updatedItems);
                    }}
                    className={styles.inputField}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index].price = e.target.value;
                      setItems(updatedItems);
                    }}
                    className={styles.inputField}
                  />
                </td>
                <td>
                  <button type="button" onClick={() => handleRemoveItem(index)} className={styles.removeButton}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="7">
                <button type="button" onClick={handleAddItem} className={styles.addButton}>
                  품목 추가
                </button>
              </td>
            </tr>
            <tr>
              <td colSpan="7">구매사유 (구체적으로 작성)</td>
            </tr>
            <tr>
              <td colSpan="7">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={styles.textareaField}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="7">특기사항</td>
            </tr>
            <tr>
              <td colSpan="7">
                <textarea
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  className={styles.textareaField}
                />
              </td>
            </tr>
            <tr>
              <td>근거서류</td>
              <td colSpan="7">
                <input
                  type="radio"
                  value="견적서"
                  checked={attachedDocs === '견적서'}
                  onChange={(e) => setAttachedDocs(e.target.value)}
                />
                견적서
                <input
                  type="radio"
                  value="계약서"
                  checked={attachedDocs === '계약서'}
                  onChange={(e) => setAttachedDocs(e.target.value)}
                />
                계약서
                <input
                  type="radio"
                  value="카다로그"
                  checked={attachedDocs === '카다로그'}
                  onChange={(e) => setAttachedDocs(e.target.value)}
                />
                카다로그
                <input
                  type="radio"
                  value="기타"
                  checked={attachedDocs === '기타'}
                  onChange={(e) => setAttachedDocs(e.target.value)}
                />
                기타
                <input
                  type="text"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className={styles.inputField}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" className={styles.submitButton}>
          제출
        </button>
      </form>
    </div>
  );
};

export default CompanyUserDraftwritePurc