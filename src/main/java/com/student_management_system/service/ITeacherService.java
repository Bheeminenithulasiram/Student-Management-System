package com.student_management_system.service;

import com.student_management_system.dtos.LoginDTO;
import com.student_management_system.model.Teacher;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ITeacherService {

    Teacher registerTeacher(Teacher teacher, MultipartFile imageFile) throws IOException;

    Teacher getTeacherById(Long id);

    Teacher updateTeacher(Long id, Teacher teacher);

    List<Teacher> getAllTeachers();

    String deleteTeacher(Long id);

    Teacher loginTeacher(LoginDTO loginDTO);
}
