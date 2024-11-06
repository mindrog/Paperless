package com.ss.paperless.email;

import com.ss.paperless.employee.entity.EmployeeEntity;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "UserEmailStatus")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserEmailStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Emailmessage와 다대일 관계 설정
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "email_no", nullable = false)
    private Emailmessage email;

    // EmployeeEntity와 다대일 관계 설정 (user)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private EmployeeEntity user;

    @Column(name = "folder", nullable = false, length = 20)
    private String folder = "inbox"; // 'inbox', 'sent', 'trash' 

    @Column(name = "status", nullable = false, length = 20)
    private String status = "unread"; // 'unread', 'read' 

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
