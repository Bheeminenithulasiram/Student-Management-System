package com.student_management_system.service.impl;

import com.student_management_system.model.Outing;
import com.student_management_system.model.Student;
import com.student_management_system.model.Warden;
import com.student_management_system.repository.IOutingRepository;
import com.student_management_system.repository.IStudentRepository;
import com.student_management_system.repository.IWardenRepository;
import com.student_management_system.service.IOutingService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class OutingService implements IOutingService {

    @Autowired
    private IOutingRepository outingRepository;

    @Autowired
    private IStudentRepository studentRepository;

    @Autowired
    private IWardenRepository wardenRepository;

    @Autowired
    private JavaMailSender javaMailSender;

    @Override
    public Outing requestOuting(Long studentId, String reason, Long wardenId, LocalDate dateFrom, LocalDate dateTo) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));

        Optional<Warden> wardenOpt = wardenRepository.findById(wardenId);
        if (!wardenOpt.isPresent()) {
            throw new RuntimeException("Warden not found with ID: " + wardenId);
        }

        // 3. Create and populate outing object
        Outing outing = new Outing();
        outing.setStudent(student);
        outing.setReason(reason);
        outing.setDateRequested(LocalDate.now());
        outing.setDateFrom(dateFrom);
        outing.setDateTo(dateTo);
        outing.setStatus(Outing.OutingStatus.PENDING);
        outing.setWardenId(wardenId);

        // 4. Save and notify
        Outing savedOuting = outingRepository.save(outing);
        sendOutingRequestEmailToWarden(student, outing, wardenId);

        return savedOuting;
    }

    private void sendOutingRequestEmailToWarden(Student student, Outing outing, Long wardenId) {

        // Fetch warden details
        Optional<Warden> wardenOpt = wardenRepository.findById(wardenId);
        if (!wardenOpt.isPresent()) {
            throw new RuntimeException("Warden not found with ID: " + wardenId);
        }

        Warden warden = wardenOpt.get();
        String wardenEmail = warden.getEmail();


        String emailBody = loadEmailTemplate(student, outing, warden);


        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(wardenEmail);
            helper.setSubject("Outing Request from Student: " + student.getName());
            helper.setText(emailBody, true); // true = HTML content


            javaMailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Something went wrong while sending the email to the warden. Please try again later.", e);
        }
    }

    private String loadEmailTemplate(Student student, Outing outing, Warden warden) {
        String templatePath = "src/main/resources/emails/outingRequestEmail.html"; // Path to your HTML file
        StringBuilder emailBody = new StringBuilder();

        try {
            BufferedReader reader = new BufferedReader(new FileReader(templatePath));
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.replace("{{studentName}}", student.getName())
                        .replace("{{wardenName}}", warden.getName())
                        .replace("{{outingReason}}", outing.getReason())
                        .replace("{{outingDate}}", outing.getDateRequested().toString())
                        .replace("{{dateFrom}}", outing.getDateFrom() != null ? outing.getDateFrom().toString() : "Not provided")
                        .replace("{{dateTo}}", outing.getDateTo() != null ? outing.getDateTo().toString() : "Not provided");
                emailBody.append(line);
            }
            reader.close();
        } catch (IOException e) {
            throw new RuntimeException("Error reading email template: " + e.getMessage(), e);
        }

        return emailBody.toString();
    }




    @Override
    public List<Outing> getOutingRequestsByStudent(Long studentId) {

        List<Outing> byStudentId = outingRepository.findByStudentId(studentId);

        if(byStudentId.isEmpty()){
            throw new RuntimeException("no outing request from student havind id: "+studentId);
        }
        else{
            return byStudentId;
        }
    }

    @Override
    public List<Outing> getPendingOutingRequests() {
        return outingRepository.findByStatus(Outing.OutingStatus.PENDING);
    }

    @Override
    public Outing updateOutingStatus(Long outingId, Outing.OutingStatus status, Long wardenId) {
        Outing outing = outingRepository.findById(outingId).orElseThrow(() -> new RuntimeException("Outing not found"));

        if (outing.getStatus() == Outing.OutingStatus.APPROVED || outing.getStatus() == Outing.OutingStatus.REJECTED) {
            throw new RuntimeException("Outing request has already been processed.");
        }

        outing.setStatus(status);
        outing.setDateApproved(LocalDate.now());

        Outing updatedOuting = outingRepository.save(outing);

        return updatedOuting;
    }


    @Override
    public List<Outing> getApprovedOutingRequests() {
        List<Outing> byStatus = outingRepository.findByStatus(Outing.OutingStatus.APPROVED);
        if(byStatus.isEmpty()){
            throw new RuntimeException("no approved request found");
        }
        else{
            return byStatus;
        }
    }

    @Override
    public Map<String, Object> getMonthlyOutings(int year, int month, Long studentId) {

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Outing> studentOutings = outingRepository.findByStudentIdAndDateRequestedBetween(studentId, startDate, endDate);

        if (studentOutings == null || studentOutings.isEmpty()) {
            throw new RuntimeException("No outings found for student with ID: " + studentId + " in " + month + "/" + year);
        }

        long studentOutingCount = studentOutings.size();


        Map<String, Object> response = new HashMap<>();
        response.put("outingCount", studentOutingCount);
        response.put("outingDetails", studentOutings);

        return response;
    }



}
