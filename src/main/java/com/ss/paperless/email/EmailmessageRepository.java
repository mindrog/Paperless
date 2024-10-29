package com.ss.paperless.email;

import com.ss.paperless.email.Emailmessage;
import com.ss.paperless.employee.EmployeeEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailmessageRepository extends JpaRepository<Emailmessage, Long> {
	List<Emailmessage> findByRecipient(EmployeeEntity recipient);
    List<Emailmessage> findByWriterOrRecipient(EmployeeEntity writer, EmployeeEntity recipient);
}