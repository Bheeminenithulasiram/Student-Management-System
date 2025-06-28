package com.student_management_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "wardens")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Warden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String password;

    private String mobile;

    private String imageUrl;

    private LocalDate updateDate;
}

