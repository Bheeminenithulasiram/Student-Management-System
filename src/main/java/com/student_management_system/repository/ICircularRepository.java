package com.student_management_system.repository;

import com.student_management_system.model.Circular;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ICircularRepository extends JpaRepository<Circular,Long> {
}
