package in.sp.codesync.repository;

import in.sp.codesync.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByOwnerEmail(String ownerEmail);

    Optional<Project> findByIdAndOwnerEmail(Long id, String ownerEmail);

    // 🛠️ FIX: Replaced MEMBER OF with a LEFT JOIN to prevent Hibernate from hiding empty-collection projects
    @Query("SELECT DISTINCT p FROM Pro" +
            "ject p LEFT JOIN p.sharedWithEmails collabs WHERE p.ownerEmail = :email OR collabs = :email")
    List<Project> findByOwnerEmailOrSharedWith(@Param("email") String email);
}