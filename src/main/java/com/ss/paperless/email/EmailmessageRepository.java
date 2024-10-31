package com.ss.paperless.email;

import com.ss.paperless.employee.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailmessageRepository extends JpaRepository<Emailmessage, Long>, JpaSpecificationExecutor<Emailmessage> {
    
}
