package in.sp.codesync.service.impl;

import in.sp.codesync.dto.request.FileRequest;
import in.sp.codesync.entity.FileEntity;
import in.sp.codesync.entity.Project;
import in.sp.codesync.repository.FileRepository;
import in.sp.codesync.repository.ProjectRepository;
import in.sp.codesync.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final FileRepository fileRepository;
    private final ProjectRepository projectRepository;

    @Override
    public FileEntity createFile(FileRequest request) {

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        FileEntity file = FileEntity.builder()
                .fileName(request.getFileName())
                .language(request.getLanguage())
                .content(request.getContent())
                .project(project)
                .build();

        return fileRepository.save(file);
    }

    @Override
    public List<FileEntity> getFilesByProject(Long projectId) {
        return fileRepository.findByProjectId(projectId);
    }

    @Override
    public FileEntity updateFile(Long fileId, FileRequest request) {

        FileEntity existingFile = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        if (request.getFileName() != null) {
            existingFile.setFileName(request.getFileName());
        }

        if (request.getContent() != null) {
            existingFile.setContent(request.getContent());
        }

        if (request.getLanguage() != null) {
            existingFile.setLanguage(request.getLanguage());
        }

        return fileRepository.save(existingFile);
    }

    @Override
    public void deleteFile(Long id) {

        FileEntity file = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        fileRepository.delete(file);
    }
    @Override
    public FileEntity getFileById(Long id) {
        return fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }

    @Override
    public FileEntity renameFile(Long id, String fileName) {
        return null;
    }
}