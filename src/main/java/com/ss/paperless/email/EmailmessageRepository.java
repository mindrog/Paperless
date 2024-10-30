package com.ss.paperless.email;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailmessageRepository extends JpaRepository<Emailmessage, Long>, JpaSpecificationExecutor<Emailmessage> {
    // 기본 CRUD와 Specification 기능을 모두 지원
}
