package com.ss.paperless.stock;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class StockDTO {
	private int stock_no;
	private int stock_comp_no;// 회사번호
	private String stock_name;// 재고명
	private String stock_category;// 재고품목
	private int stock_amount;// 재고수량
}
