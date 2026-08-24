package in.sp.codesync.repository;

import in.sp.codesync.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long> {

    // Get all files of a project
    List<FileEntity> findByProjectId(Long projectId);

    // Check if a file with the same name already exists in a project
    boolean existsByProjectIdAndFileName(Long projectId, String fileName);

    // Find a file by its name within a project
    FileEntity findByProjectIdAndFileName(Long projectId, String fileName);
}