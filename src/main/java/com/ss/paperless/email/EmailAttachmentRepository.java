package com.ss.paperless.email;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ss.paperless.employee.entity.EmployeeEntity;

@Repository
public interface EmailAttachmentRepository extends JpaRepository<EmailAttachment, EmailAttachmentId> {
	List<EmailAttachment> findByEmailNo(Long emailNo);
	boolean existsByEmailNo(Long emailNo);
	
	@Query("SELECT CASE WHEN COUNT(ea) > 0 THEN TRUE ELSE FALSE END FROM EmailAttachment ea WHERE ea.attaNo = :attaNo AND (ea.email.writer = :writer OR ea.email.recipient = :writer)")
	boolean existsByAttaNoAndEmailWriterOrEmailRecipient(@Param("attaNo") Long attaNo, @Param("writer") EmployeeEntity writer);
}