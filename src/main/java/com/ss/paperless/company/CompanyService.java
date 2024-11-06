package com.ss.paperless.company;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {
	
	private final CompanyRepository companyRepository;

	@Autowired
	public CompanyService(CompanyRepository companyRepository) {
		this.companyRepository = companyRepository;
	}
	@Autowired
	CompanyMapper mapper;
	
	public CompanyEntity findByCompNo(Long compNo) {
        return companyRepository.findByCompNo(compNo);
    }

	public CompanyDTO GetCompInfo(int comp_no) {
		
		return mapper.GetCompInfo(comp_no);
	}

	public int GetCompHeadcount(int comp_no) {
		// TODO Auto-generated method stub
		return mapper.GetCompHeadcount(comp_no);
	}
}
