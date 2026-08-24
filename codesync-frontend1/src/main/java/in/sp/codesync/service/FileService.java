package in.sp.codesync.service;

import in.sp.codesync.dto.request.FileRequest;
import in.sp.codesync.entity.FileEntity;

import java.util.List;

public interface FileService {

    FileEntity createFile(FileRequest request);

    List<FileEntity> getFilesByProject(Long projectId);

    FileEntity updateFile(Long id, FileRequest request);

    void deleteFile(Long id);
    FileEntity getFileById(Long id);
    FileEntity renameFile(Long id, String fileName);
}