package com.ss.paperless.email;

import com.ss.paperless.email.Emailmessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailmessageRepository extends JpaRepository<Emailmessage, Long> {
   
}