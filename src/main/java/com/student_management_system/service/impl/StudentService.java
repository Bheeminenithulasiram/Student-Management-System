package com.student_management_system.service.impl;


import com.student_management_system.model.Student;
import com.student_management_system.repository.IStudentRepository;
import com.student_management_system.service.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StudentService implements IStudentService {

    @Autowired
    private IStudentRepository studentRepository;


    @Value("${files.directory}")
    private String uploadDirectory;


    @Override
    public Student registerStudent(Student student, MultipartFile file) throws IOException {

        Optional<Student> byEmail = studentRepository.findByEmail(student.getEmail());
        if (byEmail.isPresent()) {
            throw new RuntimeException("Student already exists with email: " + student.getEmail());
        }

        Path path = Path.of(uploadDirectory);
        if (Files.notExists(path)) {
            Files.createDirectories(path);
        }

        String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
        Path targetPath = path.resolve(fileName);


        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/images/")
                .path(fileName)
                .toUriString();

        student.setStatus(Student.StudentStatus.PENDING);
        student.setEnrollmentDate(LocalDate.now());
        student.setUpdateDate(LocalDate.now());
        student.setImageUrl(imageUrl);

        return studentRepository.save(student);
    }

    @Override
    public Student loginStudent(String email, String password) {
        Optional<Student> studentOpt = studentRepository.findByEmail(email);

        if (!studentOpt.isPresent()) {
            throw new RuntimeException("Student not found with email: " + email);
        }

        Student student = studentOpt.get();

        if (student.getStatus() != Student.StudentStatus.ACCEPTED) {
            throw new RuntimeException("Student account is not approved. Please wait for approval.");
        }


        if (!student.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password for email: " + email);
        }

        return student;
    }


    @Override
    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Student not found with ID: " + id));
    }

    @Override
    public Student updateStudentStatus(Long id, Student.StudentStatus status) {
        Student student = studentRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Student not found with ID: " + id));

        student.setStatus(status);
        student.setUpdateDate(LocalDate.now());
        return studentRepository.save(student);
    }

    @Override
    public List<Student> getAllPendingStudents() {

        List<Student> byStatus = studentRepository.findByStatus(Student.StudentStatus.PENDING);

        if(byStatus.isEmpty()){
            throw new RuntimeException("no pending requests");
        }
        else{
            return byStatus;
        }
    }

    @Override
    public List<Student> getAllAcceptedStudents() {

        List<Student> byStatus = studentRepository.findByStatus(Student.StudentStatus.ACCEPTED);

        if(byStatus.isEmpty()){
            throw new RuntimeException("no pending requests");
        }
        else{
            return byStatus;
        }
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    @Override
    public String deleteStudent(Long id) {
        Student student = studentRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Student not found with ID: " + id));

        studentRepository.delete(student);
        return "Student deleted successfully";
    }
    @Override
    public Student updateProfile(Long studentId, String linkedIn, String instagram) {

        Student student = studentRepository.findById(studentId).orElseThrow(() ->
                new RuntimeException("Student not found with ID: " + studentId));

        if (linkedIn != null && !linkedIn.isEmpty()) {
            student.setLinkedIn(linkedIn);
        }

        if (instagram != null && !instagram.isEmpty()) {
            student.setInstagram(instagram);
        }

        student.setUpdateDate(LocalDate.now());
        student.setLinkedIn(linkedIn);
        student.setInstagram(instagram);
        studentRepository.save(student);

        return student;
    }

}


