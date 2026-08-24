package in.sp.codesync.service.impl;

import in.sp.codesync.dto.reponse.ProjectResponse;
import in.sp.codesync.dto.request.ProjectRequest;
import in.sp.codesync.entity.Project;
import in.sp.codesync.repository.ProjectRepository;
import in.sp.codesync.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import in.sp.codesync.entity.FileEntity;
import in.sp.codesync.repository.FileRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final FileRepository fileRepository;

    @Override
    public Project createProject(ProjectRequest request, String ownerEmail) {

        Project project = Project.builder()
                .projectName(request.getProjectName())
                .description(request.getDescription())
                .ownerEmail(ownerEmail)
                .build();

        // Save project
        Project savedProject = projectRepository.save(project);

        // Create default Main.java
        FileEntity defaultFile = FileEntity.builder()
                .fileName("Main.java")
                .language("java")
                .content("""
public class Main {

    public static void main(String[] args) {

        System.out.println("Hello, CodeSync!");

    }

}
""")
                .project(savedProject)
                .build();

        fileRepository.save(defaultFile);

        return savedProject;
    }


    @Override
    public List<Project> getProjects(String ownerEmail) {
        return projectRepository.findByOwnerEmail(ownerEmail);
    }

    @Override
    public Project getProjectById(Long id, String ownerEmail) {
        return projectRepository.findByIdAndOwnerEmail(id, ownerEmail)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @Override
    public Project updateProject(Long id,
                                 ProjectRequest request,
                                 String ownerEmail) {

        Project project = projectRepository.findByIdAndOwnerEmail(id, ownerEmail)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setProjectName(request.getProjectName());
        project.setDescription(request.getDescription());

        return projectRepository.save(project);
    }

    @Override
    public void deleteProject(Long id, String ownerEmail) {
        Project project = projectRepository.findByIdAndOwnerEmail(id, ownerEmail)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        projectRepository.delete(project);


    }
}