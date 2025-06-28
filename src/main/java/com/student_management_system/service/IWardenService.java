package com.student_management_system.service;

import com.student_management_system.dtos.LoginDTO;
import com.student_management_system.model.Warden;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IWardenService {

    Warden registerWarden(Warden warden, MultipartFile imageFile) throws IOException;

    Warden loginWarden(LoginDTO loginDTO);

    Warden getWardenById(Long id);

    Warden updateWarden(Long id, Warden warden);

    List<Warden> getAllWardens();

    String deleteWarden(Long id);
}
