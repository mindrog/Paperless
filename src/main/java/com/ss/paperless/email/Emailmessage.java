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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "email_writer", nullable = false)
	private EmployeeEntity writer;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "email_recipient", nullable = false)
	private EmployeeEntity recipient;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "email_cc")
	private EmployeeEntity cc; 

	@Column(name = "email_content", nullable = false, length = 500)
	private String content;

	@Column(name = "email_status", nullable = false, length = 100)
	private String status = "unread";

	@Column(name = "email_send_date", nullable = false)
	@Temporal(TemporalType.TIMESTAMP)
	private Date sendDate = new Date();

	@Column(name = "email_title", nullable = false, length = 255)
	private String title;

	// 향후 첨부파일 기능을 위한 필드 및 관계 설정은 나중에 추가
}