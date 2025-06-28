package com.student_management_system.dtos;

import lombok.*;

import java.time.LocalDate;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceDTO {

    private String subject;
    private String date;
    private String time;
    private List<StudentAttendanceRecord> records;

    @Data
    @Getter
    @Setter
    public static class StudentAttendanceRecord {
        private Long studentId;
        private Boolean isPresent;
    }
}

