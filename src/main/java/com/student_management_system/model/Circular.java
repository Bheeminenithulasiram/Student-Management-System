package com.student_management_system.model;


import jakarta.persistence.*;
import jdk.jfr.DataAmount;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "circulars")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Circular {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate dateIssued;
    private String fileUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private CircularStatus status = CircularStatus.PENDING;

    // Enum definition for status values
    public enum CircularStatus {
        PENDING, APPROVED, REJECTED
    }


}
