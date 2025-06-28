package com.student_management_system.service;

import com.student_management_system.model.Circular;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ICircularService {

     Circular createCircularAdmin(Circular circular, MultipartFile file) throws IOException;

     Circular createCircularTeacher(Circular circular, MultipartFile file) throws IOException;

     Circular getCircularById(Long id);

     List<Circular> getAllCirculars();

   //

    String deleteCircular(Long id);

    public Circular updateCircular(Circular circular);
}
