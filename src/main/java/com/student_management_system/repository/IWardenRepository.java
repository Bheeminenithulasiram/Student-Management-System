package com.student_management_system.repository;

import com.student_management_system.model.Warden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface IWardenRepository extends JpaRepository<Warden,Long> {

    Optional<Warden> findByEmail(String email);
}
