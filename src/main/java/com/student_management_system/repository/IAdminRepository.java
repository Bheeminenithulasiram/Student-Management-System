package com.student_management_system.repository;

import com.student_management_system.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IAdminRepository extends JpaRepository<Admin, Long> {
    Admin findByEmail(String email);
}
