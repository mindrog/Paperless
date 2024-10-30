package com.ss.paperless.email;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ss.paperless.employee.entity.EmployeeEntity;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Emailmessage")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Emailmessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "email_no")
    private Long emailNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "email_writer", nullable = false)
    @JsonIgnore
    private EmployeeEntity writer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "email_recipient", nullable = false)
    @JsonIgnore
    private EmployeeEntity recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "email_cc")
    @JsonIgnore
    private EmployeeEntity cc;

    @Column(name = "email_content", nullable = false, length = 500)
    private String content;

    @Column(name = "email_status", nullable = false, length = 100)
    private String status = "unread";

    @Column(name = "email_send_date", nullable = false)
    private LocalDateTime sendDate = LocalDateTime.now();

    @Column(name = "email_title", nullable = false, length = 255)
    private String title;

}
