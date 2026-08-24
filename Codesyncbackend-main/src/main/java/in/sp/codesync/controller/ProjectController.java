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

import java.util.Map;
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

        String token = httpRequest.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);

        return ResponseEntity.ok(
                projectService.createProject(request, email)
        );
    }

    // 🛠️ FIX: Standardized to use manual JWT extraction like the rest of your controller
    @GetMapping
    public ResponseEntity<List<Project>> getProjects(HttpServletRequest request) {

        System.out.println("\n====== DEBUG GET PROJECTS ======");

        String token = request.getHeader("Authorization").substring(7);
        String email = jwtService.extractUsername(token);
        System.out.println("1. Extracted Email from Token: '" + email + "'");

        // Fetch from Service
        List<Project> projects = projectService.getProjectsByUser(email);

        if (projects == null) {
            System.out.println("2. ERROR: projectService returned NULL!");
        } else {
            System.out.println("2. SUCCESS: projectService returned " + projects.size() + " projects.");
            for (Project p : projects) {
                System.out.println("   -> Found Project: " + p.getProjectName() + " (Owner: " + p.getOwnerEmail() + ")");
            }
        }
        System.out.println("================================\n");

        return ResponseEntity.ok(projects);
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

    // 🛠️ Share Project Endpoint
    // 🛠️ FIX: Added HttpServletRequest to match your other endpoints
    @PostMapping("/{projectId}/share")
    public ResponseEntity<String> shareProject(
            @PathVariable Long projectId,
            @RequestBody Map<String, String> payload,
            HttpServletRequest request) {

        // Extract token just to ensure the user is fully authenticated
        String token = request.getHeader("Authorization").substring(7);
        String ownerEmail = jwtService.extractUsername(token);

        String collaboratorEmail = payload.get("email");

        if (collaboratorEmail == null || collaboratorEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        if (collaboratorEmail.equals(ownerEmail)) {
            return ResponseEntity.badRequest().body("You cannot share a project with yourself!");
        }

        projectService.shareProject(projectId, collaboratorEmail);

        return ResponseEntity.ok("Project successfully shared with " + collaboratorEmail);
    }
};