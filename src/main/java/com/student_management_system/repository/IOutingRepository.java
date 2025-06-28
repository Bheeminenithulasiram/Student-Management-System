package com.student_management_system.repository;

import com.student_management_system.model.Outing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface IOutingRepository extends JpaRepository<Outing, Long> {

    List<Outing> findByStudentId(Long studentId);

    List<Outing> findByStatus(Outing.OutingStatus status);

    List<Outing> findByDateRequestedBetween(LocalDate startDate, LocalDate endDate);

    List<Outing> findByStudentIdAndDateRequestedBetween(Long studentId, LocalDate startDate, LocalDate endDate);
}

