package com.student_management_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDate;

@Entity
@Table(name = "outings")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Outing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @NotNull
    private String reason;

    @NotNull
    private LocalDate dateRequested;

    @NotNull
    private LocalDate dateFrom;

    @NotNull
    private LocalDate dateTo;

    private Long wardenId;

    @Enumerated(EnumType.STRING)
    @NotNull
    private OutingStatus status = OutingStatus.PENDING;

    private LocalDate dateApproved;

    public enum OutingStatus {
        PENDING, APPROVED, REJECTED
    }
}
