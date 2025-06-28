package com.student_management_system.controller;

import com.student_management_system.config.AdminConfig;
import com.student_management_system.dtos.LoginDTO;
import com.student_management_system.model.*;
import com.student_management_system.repository.IAdminRepository;
import com.student_management_system.service.ICircularService;
import com.student_management_system.service.IStudentService;
import com.student_management_system.service.ITeacherService;
import com.student_management_system.service.IWardenService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminConfig adminConfig;

    @Autowired
    private IAdminRepository adminRepository;

    @Autowired
    private ITeacherService teacherService;

    @Autowired
    private IWardenService wardenService;

    @Autowired
    private ICircularService circularService;

    @Autowired
    private IStudentService studentService;


    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;



    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginDTO loginDTO) {

        HashMap<String, Object> response = new HashMap<>();

        if (!loginDTO.getEmail().equals(adminConfig.getEmail())) {
            response.put("status", "error");
            response.put("message", "Invalid email");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        if (!loginDTO.getPassword().equals(adminConfig.getPassword())) {
            response.put("status", "error");
            response.put("message", "Invalid password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        Admin byEmail = adminRepository.findByEmail(loginDTO.getEmail());
        response.put("status", "success");
        response.put("message", "Admin logged in successfully");
        response.put("data",byEmail);
        return ResponseEntity.ok(response);
    }

    /// Manage Terachers
    @PostMapping("/teacher-register")
    public ResponseEntity<Map<String, Object>> registerTeacher(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String mobile,
            @RequestParam String subject,
            @RequestParam MultipartFile file
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            Teacher teacher = new Teacher();
            teacher.setName(name);
            teacher.setEmail(email);
            teacher.setPassword(password);
            teacher.setSubject(subject);
            teacher.setMobile(mobile);

            Teacher savedTeacher = teacherService.registerTeacher(teacher, file);

            response.put("status", "success");
            response.put("message", "Teacher registered successfully");
            response.put("data", savedTeacher);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to register teacher: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/teacher-get/{id}")
    public ResponseEntity<Map<String, Object>> getTeacherById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Teacher teacher = teacherService.getTeacherById(id);
            response.put("status", "success");
            response.put("message", "Teacher fetched successfully");
            response.put("data", teacher);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PutMapping("/teacher-update/{id}")
    public ResponseEntity<Map<String, Object>> updateTeacher(
            @PathVariable Long id,
            @RequestBody Teacher teacher
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Teacher updatedTeacher = teacherService.updateTeacher(id, teacher);
            response.put("status", "success");
            response.put("message", "Teacher updated successfully");
            response.put("data", updatedTeacher);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/teacher-delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteTeacher(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            String message = teacherService.deleteTeacher(id);
            response.put("status", "success");
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/teacher-getAll")
    public ResponseEntity<Map<String, Object>> getAllTeachers() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Teacher> teachers = teacherService.getAllTeachers();
            response.put("status", "success");
            response.put("message", "Teachers fetched successfully");
            response.put("data", teachers);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    //Manage Warden

    @PostMapping("/warden-register")
    public ResponseEntity<Map<String, Object>> registerWarden(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String mobile,
            @RequestParam MultipartFile file
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Warden warden = new Warden();
            warden.setName(name);
            warden.setEmail(email);
            warden.setPassword(password);
            warden.setMobile(mobile);

            Warden savedWarden = wardenService.registerWarden(warden, file);

            response.put("status", "success");
            response.put("message", "Warden registered successfully");
            response.put("data", savedWarden);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to register warden: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/warden-get/{id}")
    public ResponseEntity<Map<String, Object>> getWardenById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Warden warden = wardenService.getWardenById(id);
            response.put("status", "success");
            response.put("message", "Warden fetched successfully");
            response.put("data", warden);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PutMapping("/warden-update/{id}")
    public ResponseEntity<Map<String, Object>> updateWarden(
            @PathVariable Long id,
            @RequestBody Warden warden
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Warden updatedWarden = wardenService.updateWarden(id, warden);
            response.put("status", "success");
            response.put("message", "Warden updated successfully");
            response.put("data", updatedWarden);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/warden-delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteWarden(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            String message = wardenService.deleteWarden(id);
            response.put("status", "success");
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/warden-getAll")
    public ResponseEntity<Map<String, Object>> getAllWardens() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Warden> wardens = wardenService.getAllWardens();
            response.put("status", "success");
            response.put("message", "Wardens fetched successfully");
            response.put("data", wardens);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    //Manage Circular


    @PostMapping("/circular-create")
    public ResponseEntity<Map<String, Object>> createCircular(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam LocalDate localDate,
            @RequestParam(required = false) MultipartFile file) {

        Map<String, Object> response = new HashMap<>();
        try {
            Circular circular = new Circular();
            circular.setTitle(title);
            circular.setDescription(description);
            circular.setDateIssued(localDate);

            Circular savedCircular = circularService.createCircularAdmin(circular, file);

            response.put("status", "success");
            response.put("message", "Circular created successfully");
            response.put("data", savedCircular);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create circular: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PutMapping("/circular-update/{id}")
    public ResponseEntity<Map<String, Object>> updateCircular(@PathVariable Long id, @RequestBody Circular circular) {
        Map<String, Object> response = new HashMap<>();
        try {
            Circular updatedCircular = circularService.updateCircular(circular);
            response.put("status", "success");
            response.put("message", "Circular updated successfully");
            response.put("data", updatedCircular);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update circular: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/circular-get/{id}")
    public ResponseEntity<Map<String, Object>> getCircularById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Circular circular = circularService.getCircularById(id);
            response.put("status", "success");
            response.put("message", "Circular fetched successfully");
            response.put("data", circular);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Circular not found: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }


    @GetMapping("/circular-getAll")
    public ResponseEntity<Map<String, Object>> getAllCirculars() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Circular> circulars = circularService.getAllCirculars();
            response.put("status", "success");
            response.put("message", "Circulars fetched successfully");
            response.put("data", circulars);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "No circulars found: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @DeleteMapping("/circular-delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteCircular(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            String message = circularService.deleteCircular(id);
            response.put("status", "success");
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to delete circular: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }


    /// Manage Students


    @GetMapping("/student-getAll")
    public ResponseEntity<Map<String, Object>> getAllStudents() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Student> students = studentService.getAllStudents();
            response.put("status", "success");
            response.put("message", "Students fetched successfully");
            response.put("data", students);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to fetch students: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PutMapping("/circular-update-status")
    public ResponseEntity<Map<String, Object>> updateCircularStatus(
            @RequestBody Circular circular) {

        Map<String, Object> response = new HashMap<>();
        try {
            Circular updatedCircular = circularService.updateCircular(circular);  // Update only the status

            response.put("status", "success");
            response.put("message", "Circular status updated successfully");
            response.put("data", updatedCircular);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update circular status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostConstruct
    public void init() {
        if (adminRepository.findByEmail(adminEmail) == null) {
            Admin admin = new Admin();
            admin.setEmail(adminEmail);
            admin.setPassword(adminPassword);
            adminRepository.save(admin);
        }
    }
}
