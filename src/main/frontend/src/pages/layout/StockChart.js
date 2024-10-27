import React, { useState, forwardRef, useImperativeHandle } from 'react';
import styles from '../../styles/layout/stockChart.module.css';

const StockChart = forwardRef((props, ref) => {
    const [isDropdown, setIsDropdown] = useState({
        cpu: false,
        gpu: false,
        ram: false,
        motherboard: false,
        powerSupply: false,
        cooling: false,
        storage: false,
        case: false,
        network: false,
        peripherals: false,
        accessories: false,
    });

    // 모두 닫기 메서드
    const closeAllDropdowns = () => {
        setIsDropdown((prevState) =>
            Object.keys(prevState).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {})
        );
    };

    // ref를 통해 상위 컴포넌트에서 closeAllDropdowns 접근 가능
    useImperativeHandle(ref, () => ({
        closeAllDropdowns,
    }));

    const toggleDropdown = (category) => {
        setIsDropdown((prevState) => ({
            ...prevState,
            [category]: !prevState[category],
        }));
    };

    const productList = [
        {
            name: '기본 부품', key: 'basicParts', subMenu: [
                {
                    name: 'CPU', key: 'cpu', subMenu: [
                        { name: 'AMD 라이젠 5 5600X', key: 'amd_ryzen5_5600x', type: 'product' },
                        { name: '인텔 i5-12600K', key: 'intel_i5_12600k', type: 'product' },
                    ]
                },
                {
                    name: 'GPU', key: 'gpu', subMenu: [
                        { name: '엔비디아 GTX 1660 Super', key: 'nvidia_gtx1660_super', type: 'product' },
                        { name: '엔비디아 RTX 3060 Ti', key: 'nvidia_rtx3060_ti', type: 'product' },
                    ]
                },
                {
                    name: 'RAM', key: 'ram', subMenu: [
                        { name: 'G.Skill Ripjaws 16GB DDR4', key: 'gskill_ripjaws_16gb_ddr4', type: 'product' },
                        { name: '킹스톤 Fury 32GB DDR5', key: 'kingston_fury_32gb_ddr5', type: 'product' },
                    ]
                },
                {
                    name: '메인보드', key: 'motherboard', subMenu: [
                        { name: '기가바이트 B550 AORUS PRO', key: 'gigabyte_b550_aorus_pro', type: 'product' },
                        { name: 'ASUS TUF Gaming X570-PLUS', key: 'asus_tuf_x570_plus', type: 'product' },
                    ]
                },
                {
                    name: '파워 서플라이', key: 'powerSupply', subMenu: [
                        { name: 'EVGA SuperNOVA 750W', key: 'evga_supernova_750w', type: 'product' },
                        { name: '안텍 HCG 850W', key: 'antec_hcg_850w', type: 'product' },
                    ]
                },
                {
                    name: '쿨링 시스템', key: 'cooling', subMenu: [
                        { name: 'NZXT Kraken X63', key: 'nzxt_kraken_x63', type: 'product' },
                        { name: 'Corsair Hydro Series H150i Pro', key: 'corsair_h150i_pro', type: 'product' },
                    ]
                }
            ]
        },
        {
            name: '저장 장치', key: 'storage', subMenu: [
                {
                    name: 'SSD', key: 'ssd', subMenu: [
                        { name: '삼성 970 EVO Plus', key: 'samsung_970_evo_plus', type: 'product' },
                        { name: '크루셜 MX500 1TB', key: 'crucial_mx500_1tb', type: 'product' },
                    ]
                },
                {
                    name: 'HDD', key: 'hdd', subMenu: [
                        { name: '씨게이트 BarraCuda 4TB', key: 'seagate_barracuda_4tb', type: 'product' },
                        { name: 'WD Blue 2TB', key: 'wd_blue_2tb', type: 'product' },
                    ]
                },
                {
                    name: 'NVMe SSD', key: 'nvme_ssd', subMenu: [
                        { name: '삼성 980 PRO 1TB', key: 'samsung_980_pro_1tb', type: 'product' },
                        { name: 'WD_BLACK SN750 1TB', key: 'wd_black_sn750_1tb', type: 'product' },
                    ]
                }
            ]
        },
        {
            name: '케이스 (PC Case)', key: 'case', subMenu: [
                { name: '미들 타워 - Corsair 4000D Airflow', key: 'corsair_4000d', type: 'product' },
                { name: '풀 타워 - Phanteks Enthoo Pro', key: 'phanteks_enthoo_pro', type: 'product' },
                { name: '미니 ITX - Cooler Master NR200P', key: 'cooler_master_nr200p', type: 'product' },
            ]
        },
        {
            name: '네트워크 장비', key: 'network', subMenu: [
                { name: '랜 카드 - TP-Link Archer T5E', key: 'tplink_archer_t5e', type: 'product' },
                { name: '와이파이 확장기 - TP-Link RE450', key: 'tplink_re450', type: 'product' },
                { name: '라우터 - ASUS RT-AX88U', key: 'asus_rt_ax88u', type: 'product' },
            ]
        },
        {
            name: '주변기기', key: 'peripherals', subMenu: [
                { name: '키보드 - 덱 키보드 마이애미', key: 'deck_miami', type: 'product' },
                { name: '마우스 - 로지텍 G502 HERO', key: 'logitech_g502', type: 'product' },
                { name: '모니터 - Dell UltraSharp U2720Q', key: 'dell_u2720q', type: 'product' },
            ]
        },
        {
            name: '기타 부품 및 액세서리', key: 'accessories', subMenu: [
                { name: 'HDMI 케이블', key: 'hdmi_cable', type: 'product' },
                { name: 'DP 케이블', key: 'dp_cable', type: 'product' },
                { name: '외장 하드 - 씨게이트 Expansion 4TB', key: 'seagate_expansion_4tb', type: 'product' },
            ]
        },
    ];

    const renderMenu = (menu) => {
        const isProduct = menu.type === 'product';
        const icon = isDropdown[menu.key] ? `📂` : `📁`;

        // 선택된 상태일 때 조건부로 selectedItem 클래스 추가
        const buttonClassName = isDropdown[menu.key] ? `${styles.selectedItem}` : '';

        return (
            <li key={menu.key} className={styles.stockChartList}>
                <button
                    onClick={() => toggleDropdown(menu.key)}
                    className={buttonClassName}
                >
                    {isProduct ? `📦` : icon} {menu.name}
                </button>
                {isDropdown[menu.key] && menu.subMenu && (
                    <ul className={styles.stockChartList}>
                        {menu.subMenu.map((subMenu) => renderMenu(subMenu))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <div className={styles.container_stockChart}>
            <ul>
                {productList.map((menu) => renderMenu(menu))}
            </ul>
        </div>
    );
});

export default StockChart;
