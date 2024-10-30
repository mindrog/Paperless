package com.ss.paperless.company;

import javax.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Company")
public class CompanyEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comp_no")
    private Long compNo;
    
    @Column(name = "comp_name", nullable = false)
    private String compName;
}