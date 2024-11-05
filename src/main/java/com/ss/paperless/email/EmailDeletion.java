package com.ss.paperless.email;

import com.ss.paperless.employee.entity.EmployeeEntity;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "EmailDeletion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailDeletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "email_no", nullable = false)
    private Emailmessage emailmessage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private EmployeeEntity user;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
