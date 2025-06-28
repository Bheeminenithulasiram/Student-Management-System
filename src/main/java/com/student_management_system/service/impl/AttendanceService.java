package com.student_management_system.service.impl;


import com.student_management_system.dtos.AttendanceDTO;
import com.student_management_system.model.Attendance;
import com.student_management_system.model.Student;
import com.student_management_system.repository.IAttendanceRepository;
import com.student_management_system.repository.IStudentRepository;
import com.student_management_system.service.IAttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class AttendanceService implements IAttendanceService {

    @Autowired
    private IAttendanceRepository attendanceRepository;

    @Autowired
    private IStudentRepository studentRepository;
    @Override
    public List<Attendance> addMultipleAttendance(AttendanceDTO attendanceDTO) {
        List<Attendance> savedList = new ArrayList<>();

        if (attendanceDTO.getSubject() == null || attendanceDTO.getDate() == null || attendanceDTO.getRecords() == null) {
            throw new IllegalArgumentException("Subject, date, or records list cannot be null.");
        }

        for (AttendanceDTO.StudentAttendanceRecord record : attendanceDTO.getRecords()) {

            if (record.getStudentId() == null) {
                System.out.println("Skipping record with null studentId.");
                continue;
            }

            if (record.getIsPresent() == null) {
                System.out.println("Skipping record for studentId " + record.getStudentId() + " due to null isPresent.");
                continue;
            }

            Student student = studentRepository.findById(record.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found with ID: " + record.getStudentId()));

            Attendance attendance = new Attendance();
            attendance.setStudent(student);
            attendance.setSubject(attendanceDTO.getSubject());
            attendance.setDate(LocalDate.parse(attendanceDTO.getDate()));
            attendance.setTime(attendanceDTO.getTime());
            attendance.setIsPresent(record.getIsPresent());

            savedList.add(attendanceRepository.save(attendance));
        }

        return savedList;
    }




    @Override
    public Attendance updateAttendance(Long id, Boolean isPresent) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance record not found"));

        attendance.setIsPresent(isPresent);
        return attendanceRepository.save(attendance);
    }

    @Override
    public List<Attendance> getAttendanceByStudentId(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    @Override
    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }

    @Override
    public List<Attendance> getAttendanceBySubject(String subject) {
        return attendanceRepository.findBySubject(subject);
    }

    @Override
    public List<Attendance> getAttendanceByStudentAndSubject(Long studentId, String subject) {

        List<Attendance> byStudentIdAndSubject =
                attendanceRepository.findByStudentIdAndSubject(studentId, subject);

        if(byStudentIdAndSubject.isEmpty()){
            throw new RuntimeException("attendance not found");
        }

        else{
            return byStudentIdAndSubject;
        }

    }

    @Override
    public List<Attendance> fetchAllAttendances(){
        List<Attendance> optAtt = attendanceRepository.findAll();
        if(optAtt.isEmpty()){
            throw new RuntimeException("no attendances found");
        }


        else{
            return optAtt;
        }
    }
}
