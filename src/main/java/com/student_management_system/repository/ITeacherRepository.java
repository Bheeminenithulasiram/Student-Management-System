package com.student_management_system.repository;

import com.student_management_system.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ITeacherRepository extends JpaRepository<Teacher,Long> {

    Optional<Teacher> findByEmail(String email);


}
