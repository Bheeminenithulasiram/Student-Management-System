package com.student_management_system.controller;

import com.student_management_system.dtos.LoginDTO;
import com.student_management_system.dtos.OutingRequestDTO;
import com.student_management_system.dtos.StudentProfileUpdateDTO;
import com.student_management_system.model.Attendance;
import com.student_management_system.model.Circular;
import com.student_management_system.model.Outing;
import com.student_management_system.model.Student;
import com.student_management_system.service.IAttendanceService;
import com.student_management_system.service.ICircularService;
import com.student_management_system.service.IOutingService;
import com.student_management_system.service.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

//
//@CrossOrigin("*")
@RestController
@RequestMapping("/api/student")
public class StudentController {


    @Autowired
    private IStudentService studentService;

    @Autowired
    private ICircularService circularService;

    @Autowired
    private IAttendanceService  attendanceService;

    @Autowired
    private IOutingService outingService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerStudent(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String mobile,
            @RequestParam MultipartFile file
    ) {
        Map<String, Object> response = new HashMap<>();
        try {

            Student student = new Student();
            student.setName(name);
            student.setEmail(email);
            student.setPassword(password);
            student.setMobile(mobile);


            Student savedStudent = studentService.registerStudent(student, file);

            response.put("status", "success");
            response.put("message", "Student registered successfully");
            response.put("data", savedStudent);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to register student: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/student-get/{studentId}")
    public ResponseEntity<?> getStudentById(@PathVariable Long studentId) {

        Map<String, Object> response = new HashMap<>();
        try {

            Student studentById = studentService.getStudentById(studentId);

            response.put("status", "success");
            response.put("message", "student fetched successfully");
            response.put("data", studentById);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }



    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginStudent(@RequestBody LoginDTO loginDTO) {
        Map<String, Object> response = new HashMap<>();

        try {

            Student student = studentService.loginStudent(loginDTO.getEmail(), loginDTO.getPassword());

            response.put("status", "success");
            response.put("message", "Student logged in successfully");
            response.put("data", student);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
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

    @GetMapping("/attendance/subject/{studentId}/{subject}")
    public ResponseEntity<Map<String, Object>> getAttendanceBySubject(
            @PathVariable Long studentId, @PathVariable String subject) {

        Map<String, Object> response = new HashMap<>();
        try {
            List<Attendance> attendanceList = attendanceService.getAttendanceByStudentAndSubject(studentId, subject);

            List<Map<String, Object>> attendanceData = attendanceList.stream().map(attendance -> {
                Map<String, Object> attendanceDetails = new HashMap<>();
                attendanceDetails.put("studentId", attendance.getStudent().getId());
                attendanceDetails.put("studentName", attendance.getStudent().getName());
                attendanceDetails.put("studentImage", attendance.getStudent().getImageUrl());
                attendanceDetails.put("subject", attendance.getSubject());
                attendanceDetails.put("date", attendance.getDate());
                attendanceDetails.put("isPresent", attendance.getIsPresent());
                return attendanceDetails;
            }).collect(Collectors.toList());

            response.put("status", "success");
            response.put("message", "Attendance fetched successfully");
            response.put("data", attendanceData);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to fetch attendance: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }



    /// /Outings

    @PostMapping("/outing/request")
    public ResponseEntity<Map<String, Object>> requestOuting(
            @RequestBody OutingRequestDTO outingRequestDTO) {

        Map<String, Object> response = new HashMap<>();

        try {

            Outing outing = outingService.requestOuting(
                    outingRequestDTO.getStudentId(),
                    outingRequestDTO.getReason(),
                    outingRequestDTO.getWardenId(),
                    outingRequestDTO.getDateFrom(),
                    outingRequestDTO.getDateTo()
            );

            response.put("status", "success");
            response.put("message", "Outing requested successfully");
            response.put("data", outing);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to request outing: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }


    @GetMapping("/outing/{studentId}")
    public ResponseEntity<Map<String, Object>> getOutingRequestsByStudent(@PathVariable Long studentId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Outing> outingList = outingService.getOutingRequestsByStudent(studentId);

            response.put("status", "success");
            response.put("message", "Outing requests fetched successfully");
            response.put("data", outingList);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to fetch outing requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/update-profile/{id}")
    public ResponseEntity<Map<String, Object>> updateStudentProfile(
            @PathVariable Long id,
            @RequestBody StudentProfileUpdateDTO studentProfileUpdateDTO) {

        Map<String, Object> response = new HashMap<>();
        try {
            // Call the service method to update the profile with LinkedIn and Instagram
            Student updatedStudent = studentService.updateProfile(id, studentProfileUpdateDTO.getLinkedIn(), studentProfileUpdateDTO.getInstagram());

            response.put("status", "success");
            response.put("message", "Profile updated successfully");
            response.put("data", updatedStudent);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update profile: " + e.getMessage());
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


    @GetMapping("/fetch-attendances")
    public ResponseEntity<?> fetchAttendances() {

        Map<String, Object> response = new HashMap<>();
        try {
            // Call the service method to update the profile with LinkedIn and Instagram
            List<Attendance> attendances = attendanceService.fetchAllAttendances();

            response.put("status", "success");
            response.put("message", "attendances fetched successfully");
            response.put("data", attendances);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }




}



