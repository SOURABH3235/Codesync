package in.sp.codesync.controller;

import in.sp.codesync.dto.request.FileRequest;
import in.sp.codesync.entity.FileEntity;
import in.sp.codesync.service.FileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping
    public ResponseEntity<FileEntity> createFile(
            @Valid @RequestBody FileRequest request) {

        return ResponseEntity.ok(fileService.createFile(request));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<FileEntity>> getFiles(
            @PathVariable Long projectId) {

        return ResponseEntity.ok(fileService.getFilesByProject(projectId));
    }


    @PutMapping("/{id}")
    public ResponseEntity<FileEntity> updateFile(
            @PathVariable Long id,
            @RequestBody FileRequest request) {

        return ResponseEntity.ok(fileService.updateFile(id, request));
    }
    @GetMapping("/{id}")
    public ResponseEntity<FileEntity> getFile(@PathVariable Long id) {
        return ResponseEntity.ok(fileService.getFileById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFile(@PathVariable Long id) {

        fileService.deleteFile(id);

        return ResponseEntity.ok("File deleted successfully");
    }
    @PutMapping("/{id}/rename")
    public ResponseEntity<FileEntity> renameFile(
            @PathVariable Long id,
            @RequestBody FileRequest request) {

        return ResponseEntity.ok(
                fileService.renameFile(id, request.getFileName())
        );
    }
}