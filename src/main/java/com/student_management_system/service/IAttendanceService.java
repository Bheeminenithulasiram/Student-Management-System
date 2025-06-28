package com.student_management_system.service;

import com.student_management_system.dtos.AttendanceDTO;
import com.student_management_system.model.Attendance;

import java.time.LocalDate;
import java.util.List;

public interface IAttendanceService {

//    Attendance addAttendance(Long studentId, String subject, Boolean isPresent);

    public List<Attendance> addMultipleAttendance(AttendanceDTO attendanceDTO);

    Attendance updateAttendance(Long id, Boolean isPresent);

    List<Attendance> getAttendanceByStudentId(Long studentId);

    List<Attendance> getAttendanceByDate(LocalDate date);

    List<Attendance> getAttendanceBySubject(String subject);

    public List<Attendance> getAttendanceByStudentAndSubject(Long studentId, String subject);

    public List<Attendance> fetchAllAttendances();
}
