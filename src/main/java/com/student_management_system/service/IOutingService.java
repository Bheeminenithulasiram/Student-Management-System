package com.student_management_system.service;

import com.student_management_system.model.Outing;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface IOutingService {


    public Outing requestOuting(Long studentId, String reason, Long wardenId, LocalDate dateFrom, LocalDate dateTo);


    List<Outing> getOutingRequestsByStudent(Long studentId);


    List<Outing> getPendingOutingRequests();

    List<Outing> getApprovedOutingRequests();

    Outing updateOutingStatus(Long outingId, Outing.OutingStatus status, Long wardenId);

    public Map<String, Object> getMonthlyOutings(int year, int month, Long studentId);
}
