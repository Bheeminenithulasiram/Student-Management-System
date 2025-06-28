package com.student_management_system.controller;

import com.student_management_system.dtos.LoginDTO;
import com.student_management_system.model.Outing;
import com.student_management_system.model.Teacher;
import com.student_management_system.model.Warden;
import com.student_management_system.service.IOutingService;
import com.student_management_system.service.IWardenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


//@CrossOrigin("*")
@RestController
@RequestMapping("/api/warden")
public class WardenController {

    @Autowired
    private IOutingService outingService;

    @Autowired
    private IWardenService wardenService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginWarden(@RequestBody LoginDTO loginDTO) {
        Map<String, Object> response = new HashMap<>();

        try {

            Warden warden = wardenService.loginWarden(loginDTO);

            response.put("status", "success");
            response.put("message", "Warden logged in successfully");
            response.put("data", warden);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @GetMapping("/outing/pending")
    public ResponseEntity<Map<String, Object>> getPendingOutingRequests() {
        Map<String, Object> response = new HashMap<>();
        try {

            List<Outing> pendingOutingList = outingService.getPendingOutingRequests();
            List<Map<String, Object>> simplifiedOutingData = pendingOutingList.stream().map(outing -> {
                Map<String, Object> outingData = new HashMap<>();
                outingData.put("outingId", outing.getId());
                outingData.put("studentId", outing.getStudent().getId());
                outingData.put("studentName", outing.getStudent().getName());
                outingData.put("studentImageUrl", outing.getStudent().getImageUrl());
                outingData.put("reason", outing.getReason());
                outingData.put("dateRequested", outing.getDateRequested());
                outingData.put("dateFrom", outing.getDateFrom());
                outingData.put("dateTo", outing.getDateTo());
                outingData.put("status", outing.getStatus().toString());
                return outingData;
            }).collect(Collectors.toList());

            response.put("status", "success");
            response.put("message", "Pending outing requests fetched successfully");
            response.put("data", simplifiedOutingData);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to fetch pending outing requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/outing/approved")
    public ResponseEntity<Map<String, Object>> getAllApprovedOutings() {
        Map<String, Object> response = new HashMap<>();
        try {

            List<Outing> approvedOutings = outingService.getApprovedOutingRequests();

            List<Map<String, Object>> simplifiedOutingData = approvedOutings.stream().map(outing -> {
                Map<String, Object> outingData = new HashMap<>();
                outingData.put("studentId", outing.getStudent().getId());
                outingData.put("studentName", outing.getStudent().getName());
                outingData.put("studentImageUrl", outing.getStudent().getImageUrl());
                outingData.put("reason", outing.getReason());
                outingData.put("dateRequested", outing.getDateRequested());
                outingData.put("dateFrom", outing.getDateFrom());
                outingData.put("dateTo", outing.getDateTo());
                outingData.put("status", outing.getStatus().toString());
                outingData.put("dateApproved", outing.getDateApproved());
                return outingData;
            }).collect(Collectors.toList());

            response.put("status", "success");
            response.put("message", "Approved outing requests fetched successfully");
            response.put("data", simplifiedOutingData);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to fetch approved outing requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
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

    @PutMapping("/outing/approve-reject/{outingId}")
    public ResponseEntity<Map<String, Object>> approveOrRejectOuting(
            @PathVariable Long outingId,
            @RequestParam Long wardenId,
            @RequestParam String status
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Outing.OutingStatus outingStatus = Outing.OutingStatus.valueOf(status.toUpperCase());
            Outing updatedOuting = outingService.updateOutingStatus(outingId, outingStatus, wardenId);

            response.put("status", "success");
            response.put("message", "Outing status updated successfully");
            response.put("data", updatedOuting);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update outing status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/outings/monthly/{studentId}")
    public ResponseEntity<Map<String, Object>> getMonthlyOutings(
            @PathVariable Long studentId,
            @RequestParam int year,
            @RequestParam int month) {

        Map<String, Object> response = new HashMap<>();

        try {

            Map<String, Object> monthlyOutingsData = outingService.getMonthlyOutings(year, month, studentId);

            List<Map<String, Object>> simplifiedOutingData = ((List<Outing>) monthlyOutingsData.get("outingDetails")).stream()
                    .map(outing -> {
                        Map<String, Object> outingData = new HashMap<>();
                        outingData.put("studentId", outing.getStudent().getId());
                        outingData.put("studentName", outing.getStudent().getName());
                        outingData.put("studentImageUrl", outing.getStudent().getImageUrl());
                        outingData.put("reason", outing.getReason());
                        outingData.put("dateRequested", outing.getDateRequested());
                        outingData.put("dateFrom", outing.getDateFrom());
                        outingData.put("dateTo", outing.getDateTo());
                        outingData.put("status", outing.getStatus().toString());
                        outingData.put("dateApproved", outing.getDateApproved());
                        return outingData;
                    }).collect(Collectors.toList());

            response.put("status", "success");
            response.put("message", "Monthly outings fetched successfully");
            response.put("outingCount", monthlyOutingsData.get("outingCount"));
            response.put("outingDetails", simplifiedOutingData);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to fetch monthly outings: " + e.getMessage());
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
