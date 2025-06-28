package com.student_management_system.service;

import com.student_management_system.model.Student;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IStudentService {


    Student registerStudent(Student student, MultipartFile file) throws IOException;


    Student getStudentById(Long id);


    Student updateStudentStatus(Long id, Student.StudentStatus status);


    List<Student> getAllPendingStudents();

    List<Student> getAllAcceptedStudents();


    List<Student> getAllStudents();

    String deleteStudent(Long id);

    Student loginStudent(String email, String password);

    Student updateProfile(Long studentId, String linkedIn, String instagram);
}
