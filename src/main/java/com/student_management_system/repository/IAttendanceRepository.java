package com.student_management_system.repository;

import com.student_management_system.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface IAttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentId(Long studentId);

    List<Attendance> findByDate(LocalDate date);

    List<Attendance> findBySubject(String subject);

    List<Attendance> findByStudentIdAndSubject(Long studentId, String subject);

}
