package in.sp.codesync.controller;

import in.sp.codesync.dto.request.ProjectRequest;
import in.sp.codesync.entity.Project;
import in.sp.codesync.security.JwtService;
import in.sp.codesync.service.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<Project> createProject(
            @Valid @RequestBody ProjectRequest request,
            HttpServletRequest httpRequest) {

        String authHeader = httpRequest.getHeader("Authorization");
        String token = authHeader.substring(7);

        String email = jwtService.extractUsername(token);

        return ResponseEntity.ok(
                projectService.createProject(request, email)
        );
    }

    @GetMapping
    public ResponseEntity<List<Project>> getProjects(
            HttpServletRequest httpRequest) {

        String authHeader = httpRequest.getHeader("Authorization");
        String token = authHeader.substring(7);

        String email = jwtService.extractUsername(token);

        return ResponseEntity.ok(
                projectService.getProjects(email)
        );

    }
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable Long id,
                                              HttpServletRequest request) {

        String token = request.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);

        return ResponseEntity.ok(
                projectService.getProjectById(id, email)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id,
                                                 @RequestBody ProjectRequest projectRequest,
                                                 HttpServletRequest request) {

        String token = request.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);

        return ResponseEntity.ok(
                projectService.updateProject(id, projectRequest, email)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProject(@PathVariable Long id,
                                                HttpServletRequest request) {

        String token = request.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);

        projectService.deleteProject(id, email);

        return ResponseEntity.ok("Project deleted successfully");
    }
}