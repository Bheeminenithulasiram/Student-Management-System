package com.student_management_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OutingRequestDTO {

    private Long studentId;
    private String reason;
    private LocalDate requestedDate;//Auto Generated
    private Long wardenId;
    private LocalDate dateFrom;
    private LocalDate dateTo;
}
