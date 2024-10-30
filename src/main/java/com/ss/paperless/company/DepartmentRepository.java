package com.ss.paperless.company;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<DepartmentEntity, Long> {
	DepartmentEntity findByDeptNo(Long deptNo);
}