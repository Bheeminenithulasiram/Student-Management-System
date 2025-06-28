package com.student_management_system.service.impl;

import com.student_management_system.dtos.LoginDTO;
import com.student_management_system.model.Teacher;
import com.student_management_system.repository.ITeacherRepository;
import com.student_management_system.service.ITeacherService;
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
public class TeacherService implements ITeacherService {

    @Autowired
    private ITeacherRepository teacherRepository;

    @Value("${files.directory}")
    private String uploadDirectory;


    @Override
    public Teacher registerTeacher(Teacher teacher, MultipartFile imageFile) throws IOException {
        Optional<Teacher> byEmail = teacherRepository.findByEmail(teacher.getEmail());
        if (byEmail.isPresent()) {
            throw new RuntimeException("Teacher alreaady exists with email: " + teacher.getEmail());
        }

        Path path = Path.of(uploadDirectory);
        if (Files.notExists(path)) {
            Files.createDirectories(path);
        }

        String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(imageFile.getOriginalFilename());
        Path targetPath = path.resolve(fileName);

        Files.copy(imageFile.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/images/")
                .path(fileName)
                .toUriString();

        teacher.setImageUrl(imageUrl);
        teacher.setUpdateDate(LocalDate.now());
        return teacherRepository.save(teacher);
    }

    @Override
    public Teacher getTeacherById(Long id) {

        return teacherRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Teacher not found with ID: " + id));
    }


    @Override
    public Teacher updateTeacher(Long id, Teacher teacher) {

        Teacher existingTeacher = teacherRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Teacher not found with ID: " + id));

        existingTeacher.setName(teacher.getName());
        existingTeacher.setEmail(teacher.getEmail());
        existingTeacher.setMobile(teacher.getMobile());
        existingTeacher.setUpdateDate(LocalDate.now());

        return teacherRepository.save(existingTeacher);
    }


    @Override
    public List<Teacher> getAllTeachers() {
        List<Teacher> teachers = teacherRepository.findAll();
        if (teachers.isEmpty()) {
            throw new RuntimeException("No teachers found");
        }
        return teachers;
    }


    @Override
    public String deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Teacher not found with ID: " + id));

        teacherRepository.delete(teacher);
        return "Teacher deleted successfully";
    }

    @Override
    public Teacher loginTeacher(LoginDTO loginDTO) {

        Optional<Teacher> byEmail = teacherRepository.findByEmail(loginDTO.getEmail());
        if (!byEmail.isPresent()) {
            throw new RuntimeException("Teacher not found with email " + loginDTO.getEmail());
        }
        Teacher teacher = byEmail.get();
        if (!teacher.getPassword().equals(loginDTO.getPassword())) {
            throw new RuntimeException("Invalid password for email " + loginDTO.getEmail());
        }
        return teacher;
    }


}

