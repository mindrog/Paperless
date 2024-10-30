package com.ss.paperless.company;

import javax.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Department")
public class DepartmentEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dept_no")
    private Long deptNo;
    
    @Column(name = "dept_name", nullable = false)
    private String deptName;
    
    @Column(name = "dept_team_name", nullable = false)
    private String dept_Team_Name;
}
