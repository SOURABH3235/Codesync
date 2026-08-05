package in.sp.codesync.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class ProjectResponse {

    private Long id;

    private String projectName;

    private String description;

    private String ownerEmail;

    private LocalDateTime createdAt;
}