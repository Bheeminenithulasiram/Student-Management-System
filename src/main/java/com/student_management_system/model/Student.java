package com.student_management_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "students")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String mobile;
    private LocalDate enrollmentDate;
    private LocalDate updateDate;

    @Enumerated(EnumType.STRING)
    private StudentStatus status;

    private String imageUrl;

    public enum StudentStatus {
        PENDING, ACCEPTED, REJECTED
    }

    @Column(nullable = true)
    private String linkedIn;

    @Column(nullable = true)
    private String instagram;

}
