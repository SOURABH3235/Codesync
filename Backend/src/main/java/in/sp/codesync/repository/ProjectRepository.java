package in.sp.codesync.repository;

import in.sp.codesync.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByOwnerEmail(String ownerEmail);
    Optional<Project> findByIdAndOwnerEmail(Long id, String ownerEmail);
}