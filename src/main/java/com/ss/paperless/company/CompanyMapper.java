package com.ss.paperless.company;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CompanyMapper {

	CompanyDTO GetCompInfo(int comp_no);

	int GetCompHeadcount(int comp_no);

}
