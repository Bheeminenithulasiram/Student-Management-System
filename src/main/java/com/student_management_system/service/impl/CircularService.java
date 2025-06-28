package com.student_management_system.service.impl;

import com.student_management_system.model.Circular;
import com.student_management_system.repository.ICircularRepository;
import com.student_management_system.service.ICircularService;
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
import java.util.UUID;

@Service
public class CircularService implements ICircularService {


    @Autowired
    private ICircularRepository circularRepository;

    @Value("${files.directory}")
    private String uploadDirectory;


    @Override
    public Circular createCircularAdmin(Circular circular, MultipartFile file) throws IOException {
        Path path = Path.of(uploadDirectory);
        if (Files.notExists(path)) {
            Files.createDirectories(path);
        }

        String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
        Path targetPath = path.resolve(fileName);

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/images/")
                .path(fileName)
                .toUriString();

        circular.setFileUrl(fileUrl);
        circular.setStatus(Circular.CircularStatus.APPROVED);
        return circularRepository.save(circular);
    }


    @Override
    public Circular createCircularTeacher(Circular circular, MultipartFile file) throws IOException {
        Path path = Path.of(uploadDirectory);
        if (Files.notExists(path)) {
            Files.createDirectories(path);
        }

        String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
        Path targetPath = path.resolve(fileName);

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/images/")
                .path(fileName)
                .toUriString();

        circular.setFileUrl(fileUrl);
        circular.setStatus(Circular.CircularStatus.PENDING);
        return circularRepository.save(circular);
    }

    @Override
    public Circular getCircularById(Long id) {
        return circularRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Circular not found with ID: " + id));
    }

    @Override
    public List<Circular> getAllCirculars() {
        List<Circular> all = circularRepository.findAll();
        if(all.isEmpty()){
            throw new RuntimeException("no circulars found");
        }
        else{
            return all;
        }

    }

    @Override
    public Circular updateCircular( Circular circular) {
        Circular existingCircular = circularRepository.findById(circular.getId()).orElseThrow(() ->
                new RuntimeException("Circular not found with ID: " + circular.getId()));

        // Update fields
        existingCircular.setTitle(circular.getTitle());
        existingCircular.setDescription(circular.getDescription());
        existingCircular.setDateIssued(LocalDate.now());
        existingCircular.setStatus(circular.getStatus());

        return circularRepository.save(existingCircular);
    }


    @Override
    public String deleteCircular(Long id) {
        Circular circular = circularRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Circular not found with ID: " + id));

        circularRepository.delete(circular);
        return "Circular deleted successfully";
    }
}
