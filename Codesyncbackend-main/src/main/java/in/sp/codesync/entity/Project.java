package in.sp.codesync.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🛠️ FIX: Single, correct files list mapped to FileEntity with @JsonIgnore applied
    @JsonIgnore
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FileEntity> files = new ArrayList<>();
    // 🛠️ ADD THIS BLOCK: Stores a list of emails allowed to collaborate
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "project_collaborators",
            joinColumns = @JoinColumn(name = "project_id")
    )
    @Column(name = "email")
    private Set<String> sharedWithEmails = new HashSet<>();

    @Column(nullable = false)
    private String projectName;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String ownerEmail;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }


}