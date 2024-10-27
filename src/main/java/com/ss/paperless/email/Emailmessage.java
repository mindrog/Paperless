package com.ss.paperless.email;

import javax.persistence.*;

import com.ss.paperless.employee.EmployeeEntity;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Emailmessage")
@Getter
@Setter
public class Emailmessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "email_no")
    private Long emailNo;

    @ManyToOne
    @JoinColumn(name = "email_sender")
    private EmployeeEntity sender;

    @Column(name = "email_receiver")
    private String receiverEmail;

    @Column(name = "email_cc")
    private String ccEmail;

    @Column(name = "email_title")
    private String title;

    @Column(name = "email_content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "email_sent_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date sentAt = new Date();

    @Column(name = "email_status")
    private String status = "unread";

    // 향후 첨부파일 기능을 위한 필드 및 관계 설정은 나중에 추가
}