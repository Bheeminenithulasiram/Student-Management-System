package com.student_management_system.controller;


import com.student_management_system.dtos.AttendanceDTO;
import com.student_management_system.dtos.LoginDTO;
import com.student_management_system.model.Attendance;
import com.student_management_system.model.Circular;
import com.student_management_system.model.Student;
import com.student_management_system.model.Teacher;
import com.student_management_system.service.IAttendanceService;
import com.student_management_system.service.ICircularService;
import com.student_management_system.service.IStudentService;
import com.student_management_system.service.ITeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


//@CrossOrigin("*")
@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    @Autowired
    private ITeacherService teacherService;

    @Autowired
    private IStudentService studentService;

    @Autowired
    private IAttendanceService attendanceService;

    @Autowired
    private ICircularService circularService;


    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginTeacher(@RequestBody LoginDTO loginDTO) {
        Map<String, Object> response = new HashMap<>();

        try {

            Teacher teacher = teacherService.loginTeacher(loginDTO);

            response.put("status", "success");
            response.put("message", "Teacher logged in successfully");
            response.put("data", teacher);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }


    //Manage Students
    @GetMapping("/student-getAllPending")
    public ResponseEntity<Map<String, Object>> getAllPendingStudents() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Student> students = studentService.getAllPendingStudents();


            List<Map<String, Object>> simplifiedStudentData = students.stream().map(student -> {
                Map<String, Object> studentData = new HashMap<>();
                studentData.put("studentId", student.getId());
                studentData.put("studentName", student.getName());
                studentData.put("status", student.getStatus().name());
                studentData.put("imageUrl", student.getImageUrl());
                return studentData;
            }).collect(Collectors.toList());

            response.put("status", "success");
            response.put("message", "Pending students fetched successfully");
            response.put("data", simplifiedStudentData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to fetch pending students: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @GetMapping("/student-getAllAccepted")
    public ResponseEntity<Map<String, Object>> getAllAcceptedStudents() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Student> students = studentService.getAllAcceptedStudents();

            List<Map<String, Object>> simplifiedStudentData = students.stream().map(student -> {
                Map<String, Object> studentData = new HashMap<>();
                studentData.put("studentId", student.getId());
                studentData.put("studentName", student.getName());
                studentData.put("status", student.getStatus().name());
                studentData.put("imageUrl", student.getImageUrl());
                return studentData;
            }).collect(Collectors.toList());

            response.put("status", "success");
            response.put("message", "Accepted students fetched successfully");
            response.put("data", simplifiedStudentData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to fetch accepted students: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }




//    @GetMapping("/student-getAllAccepted")
//    public ResponseEntity<?> getAllStudents() {
//        Map<String, Object> response = new HashMap<>();
//        try {
//            List<Student> students = studentService.getAllStudents();
//
//            List<Map<String, Object>> simplifiedStudentData = students.stream().map(student -> {
//                Map<String, Object> studentData = new HashMap<>();
//                studentData.put("studentId", student.getId());
//                studentData.put("studentName", student.getName());
//                studentData.put("status", student.getStatus().name());
//                studentData.put("imageUrl", student.getImageUrl());
//                return studentData;
//            }).collect(Collectors.toList());
//
//            response.put("status", "success");
//            response.put("message", "Accepted students fetched successfully");
//            response.put("data", simplifiedStudentData);
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            response.put("status", "error");
//            response.put("message", "Failed to fetch accepted students: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//        }
//    }



    @PutMapping("/student-update-status/{id}")
    public ResponseEntity<Map<String, Object>> updateStudentStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Student.StudentStatus studentStatus = Student.StudentStatus.valueOf(status.toUpperCase());
            Student updatedStudent = studentService.updateStudentStatus(id, studentStatus);

            response.put("status", "success");
            response.put("message", "Student status updated successfully");
            response.put("data", updatedStudent);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update student status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/student-getProfiles")
    public ResponseEntity<Map<String, Object>> getAllStudentprofiles() {
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




    /// Manage Attendance

    @PostMapping("/attendance/add")
    public ResponseEntity<Map<String, Object>> addAttendance(@RequestBody AttendanceDTO attendanceDTO) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Attendance> savedRecords = attendanceService.addMultipleAttendance(attendanceDTO);

            response.put("status", "success");
            response.put("message", "Attendance added successfully for all students");
            response.put("data", savedRecords);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to add attendance: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }


    @PutMapping("/attendance/update/{id}")
    public ResponseEntity<Map<String, Object>> updateAttendance(
            @PathVariable Long id,
            @RequestParam Boolean isPresent
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Attendance updatedAttendance = attendanceService.updateAttendance(id, isPresent);

            response.put("status", "success");
            response.put("message", "Attendance updated successfully");
            response.put("data", updatedAttendance);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update attendance: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }





    @GetMapping("/attendance/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getAttendanceByStudentId(@PathVariable Long studentId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Attendance> attendanceList = attendanceService.getAttendanceByStudentId(studentId);

            response.put("status", "success");
            response.put("message", "Attendance fetched successfully");
            response.put("data", attendanceList);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to fetch attendance: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }


    @GetMapping("/attendance/date/{date}")
    public ResponseEntity<Map<String, Object>> getAttendanceByDate(@PathVariable LocalDate date) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Attendance> attendanceList = attendanceService.getAttendanceByDate(date);

            response.put("status", "success");
            response.put("message", "Attendance fetched successfully");
            response.put("data", attendanceList);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to fetch attendance: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/attendance/subject/{subject}")
    public ResponseEntity<Map<String, Object>> getAttendanceBySubject(@PathVariable String subject) {
        Map<String, Object> response = new HashMap<>();
        try {

            List<Attendance> attendanceList = attendanceService.getAttendanceBySubject(subject);

            List<Map<String, Object>> simplifiedAttendanceData = attendanceList.stream().map(attendance -> {
                Map<String, Object> attendanceData = new HashMap<>();
                attendanceData.put("studentId", attendance.getStudent().getId());
                attendanceData.put("studentName", attendance.getStudent().getName());
                attendanceData.put("studentImageUrl", attendance.getStudent().getImageUrl());
                attendanceData.put("subject", attendance.getSubject());
                attendanceData.put("date", attendance.getDate());
                attendanceData.put("isPresent", attendance.getIsPresent());
                return attendanceData;
            }).collect(Collectors.toList());

            response.put("status", "success");
            response.put("message", "Attendance fetched successfully");
            response.put("data", simplifiedAttendanceData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to fetch attendance: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }


    @GetMapping("/attendance/subject/{studentId}/{subject}")
    public ResponseEntity<Map<String, Object>> getAttendanceBySubject(
            @PathVariable Long studentId, @PathVariable String subject) {

        Map<String, Object> response = new HashMap<>();
        try {

            List<Attendance> attendanceList = attendanceService.getAttendanceByStudentAndSubject(studentId, subject);

            response.put("status", "success");
            response.put("message", "Attendance fetched successfully");
            response.put("data", attendanceList);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to fetch attendance: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /// Manage Announcements

    @PostMapping("/circular-create")
    public ResponseEntity<Map<String, Object>> createCircular(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile file) {

        Map<String, Object> response = new HashMap<>();
        try {
            Circular circular = new Circular();
            circular.setTitle(title);
            circular.setDescription(description);

            Circular savedCircular = circularService.createCircularTeacher(circular, file);

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
    public ResponseEntity<Map<String, Object>> updateCircular(@RequestBody Circular circular) {
        Map<String, Object> response = new HashMap<>();
        try {
            Circular updatedCircular = circularService.updateCircular( circular);
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

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }



}
