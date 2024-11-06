
package com.ss.paperless.email;

import com.ss.paperless.employee.entity.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserEmailStatusRepository extends JpaRepository<UserEmailStatus, Long> {
    List<UserEmailStatus> findByUserAndFolderAndDeletedAtIsNull(EmployeeEntity user, String folder);

    Optional<UserEmailStatus> findByEmailAndUser(Emailmessage email, EmployeeEntity user);

    List<UserEmailStatus> findByEmailEmailNoInAndUser(List<Long> emailNos, EmployeeEntity user);

    boolean existsByEmailEmailNo(Long emailNo);
    
    
    List<UserEmailStatus> findByUserAndFolderAndDeletedAtIsNotNull(EmployeeEntity user, String folder);
    
    
}
