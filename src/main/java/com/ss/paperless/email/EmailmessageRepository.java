package com.ss.paperless.email;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailmessageRepository extends JpaRepository<Emailmessage, Long>, JpaSpecificationExecutor<Emailmessage> {
	List<Emailmessage> findByDeletedAtBefore(LocalDateTime cutoffDate);
}
