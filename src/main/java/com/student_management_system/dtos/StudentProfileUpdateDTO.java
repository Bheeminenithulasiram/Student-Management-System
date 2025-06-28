package com.student_management_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentProfileUpdateDTO {

    private String linkedIn;
    private String instagram;
}
