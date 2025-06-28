package com.student_management_system.service.impl;

import com.student_management_system.dtos.LoginDTO;
import com.student_management_system.model.Warden;
import com.student_management_system.repository.IWardenRepository;
import com.student_management_system.service.IWardenService;
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
public class WardenService implements IWardenService {

    @Autowired
    private IWardenRepository wardenRepository;

    @Value("${files.directory}")
    private String uploadDirectory;

    @Override
    public Warden registerWarden(Warden warden, MultipartFile imageFile) throws IOException {
        Optional<Warden> byEmail = wardenRepository.findByEmail(warden.getEmail());
        if (byEmail.isPresent()) {
            throw new RuntimeException("Warden already exists with email: " + warden.getEmail());
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

        warden.setImageUrl(imageUrl);
        warden.setUpdateDate(LocalDate.now());
        return wardenRepository.save(warden);
    }

    @Override
    public Warden loginWarden(LoginDTO loginDTO) {
        Optional<Warden> byEmail = wardenRepository.findByEmail(loginDTO.getEmail());

        if(byEmail.isEmpty()){
            throw new RuntimeException("user not found");
        }
        Warden warden = byEmail.get();
        if(!warden.getEmail().equals(loginDTO.getEmail())){
            throw new RuntimeException("wrong email");
        }
        else if(!warden.getPassword().equals(loginDTO.getPassword())){
            throw new RuntimeException("invalid password");
        }

        else{
            return warden;
        }
    }







    @Override
    public Warden getWardenById(Long id) {
        return wardenRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Warden not found with ID: " + id));
    }

    @Override
    public Warden updateWarden(Long id, Warden warden) {
        Warden existingWarden = wardenRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Warden not found with ID: " + id));

        existingWarden.setName(warden.getName());
        existingWarden.setEmail(warden.getEmail());
        existingWarden.setMobile(warden.getMobile());

        existingWarden.setUpdateDate(LocalDate.now());

        return wardenRepository.save(existingWarden);
    }

    @Override
    public List<Warden> getAllWardens() {
        List<Warden> wardens = wardenRepository.findAll();
        if (wardens.isEmpty()) {
            throw new RuntimeException("No wardens found");
        }
        return wardens;
    }

    @Override
    public String deleteWarden(Long id) {
        Warden warden = wardenRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Warden not found with ID: " + id));

        wardenRepository.delete(warden);
        return "Warden deleted successfully";
    }



}
