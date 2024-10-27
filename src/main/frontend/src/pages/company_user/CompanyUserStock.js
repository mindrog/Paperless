import React, { useState, useRef  } from 'react'
import { Table, Button, Form, Modal } from 'react-bootstrap';
import styles from '../../styles/company/admin/company_member.module.css';
import stockStyle from '../../styles/layout/Stock.module.css';
import Menubar from '../layout/menubar';
import StockChart from '../layout/StockChart';


function CompanyUserStock() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [category, setCategory] = useState('');
  const stockChartRef = useRef(null); // StockChart 컴포넌트를 참조할 ref 생성

  const [inventoryData, setInventoryData] = useState([
    { id: 1, name: "Intel Core i9", category: "CPU", quantity: 10, price: 500 },
    { id: 2, name: "AMD Ryzen 9", category: "CPU", quantity: 15, price: 450 },
    { id: 3, name: "NVIDIA RTX 3080", category: "GPU", quantity: 8, price: 700 },
    { id: 4, name: "AMD Radeon RX 6800", category: "GPU", quantity: 10, price: 650 },
    { id: 5, name: "Samsung 970 EVO 1TB", category: "SSD", quantity: 20, price: 120 },
    { id: 6, name: "Crucial MX500 500GB", category: "SSD", quantity: 30, price: 80 },
    { id: 7, name: "Corsair Vengeance LPX 16GB", category: "RAM", quantity: 25, price: 75 },
    { id: 8, name: "G.Skill Ripjaws V 32GB", category: "RAM", quantity: 12, price: 140 },
    { id: 9, name: "ASUS ROG STRIX Z490-E", category: "Motherboard", quantity: 10, price: 250 },
    { id: 10, name: "MSI B450 TOMAHAWK MAX", category: "Motherboard", quantity: 15, price: 150 },
    { id: 11, name: "EVGA SuperNOVA 750W", category: "Power Supply", quantity: 18, price: 110 },
    { id: 12, name: "Corsair RM850x", category: "Power Supply", quantity: 20, price: 130 },
    { id: 13, name: "NZXT Kraken X63", category: "Cooling System", quantity: 10, price: 150 },
    { id: 14, name: "Noctua NH-D15", category: "Cooling System", quantity: 8, price: 90 },
    { id: 15, name: "Logitech MX Master 3", category: "Mouse", quantity: 30, price: 100 },
    { id: 16, name: "Razer DeathAdder V2", category: "Mouse", quantity: 25, price: 70 },
    { id: 17, name: "Dell UltraSharp U2720Q", category: "Monitor", quantity: 5, price: 600 },
    { id: 18, name: "Samsung Odyssey G9", category: "Monitor", quantity: 4, price: 1200 },
    { id: 19, name: "Western Digital Blue 1TB", category: "HDD", quantity: 50, price: 50 },
    { id: 20, name: "Seagate BarraCuda 2TB", category: "HDD", quantity: 40, price: 60 },
]);


  const handleInputChange = (e, id, field) => {
    const newValue = e.target.value;
    setInventoryData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [field]: newValue } : item
      )
    );
  };

  const handleUpdate = async (id) => {
    const updatedItem = inventoryData.find((item) => item.id === id);
    console.log("Updated item:", updatedItem);

    try {
      const response = await fetch(`/api/update-item/${id}`, {
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

      alert(`Item ${id}이(가) 업데이트되었습니다.`);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("업데이트 중 오류가 발생했습니다.");
    }
  };

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleCloseEditModal = () => setShowEditModal(false);

  // input 값 수정 송신 메서드
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleCloseAddModal();
    handleCloseEditModal();
  };

  // 모든 드롭다운을 닫는 함수
  const closeAllDropdowns = () => {
    if (stockChartRef.current) {
      stockChartRef.current.closeAllDropdowns(); // StockChart의 closeAllDropdowns 호출
    }
  };

  return (
    <div>
      <div className="container-xl">
        <Menubar />

        <div className={stockStyle.container}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
              <h1 className={styles.pageTitle}>재고 관리</h1>
            </div>
          </div>

          <div className={stockStyle.content}>
            <Table bordered className={stockStyle.contentTable}>
              <thead>
                <tr>
                  <th className={stockStyle.productChartCol}>품목차트</th>
                  <th className={stockStyle.productListCol}>품목 목록</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className={stockStyle.productChartCol}>
                    <div className={stockStyle.stockChartBox}>
                      <div className={stockStyle.dropdownCloseBtnBox}>
                        <Button className={stockStyle.dropdownCloseBtn} onClick={closeAllDropdowns}> 모두 닫기</Button>
                      </div>
                      <StockChart className={stockStyle.stockChart} ref={stockChartRef} />
                    </div>
                  </th>
                  <th className={stockStyle.productListCol}>
                    <div className={stockStyle.productTableBox}>
                      <Table className={stockStyle.productTable}>
                        <thead>
                          <tr className={styles.headBox}>
                            <th className={stockStyle.noCol}>No</th>
                            <th>품목명</th>
                            <th>카테고리</th>
                            <th>수량</th>
                            <th>가격</th>
                            <th>수정</th>
                          </tr>
                        </thead>
                        <tbody className={styles.tableBody}>
                          {inventoryData.map((item) => (
                            <tr key={item.id}>
                              <th>{item.id}</th>
                              <td>{item.name}</td>
                              <td>{item.category}</td>
                              <td>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  className={stockStyle.inputCount}
                                  onChange={(e) => handleInputChange(e, item.id, "quantity")}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={item.price}
                                  className={stockStyle.inputPrice}
                                  onChange={(e) => handleInputChange(e, item.id, "price")}
                                />
                              </td>
                              <td>
                                <Button
                                  variant="primary"
                                  className={styles.updateBtn}
                                  onClick={() => handleUpdate(item.id)}
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
            {/* content */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyUserStock;
