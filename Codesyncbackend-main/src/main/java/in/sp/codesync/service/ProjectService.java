package in.sp.codesync.service;

import in.sp.codesync.dto.request.ProjectRequest;
import in.sp.codesync.entity.Project;
import in.sp.codesync.dto.reponse.ProjectResponse;

import java.util.List;

public interface ProjectService {

    Project createProject(ProjectRequest request, String ownerEmail);

    List<Project> getProjects(String ownerEmail);

    Project getProjectById(Long id, String ownerEmail);

    Project updateProject(Long id, ProjectRequest request, String ownerEmail);

    void deleteProject(Long id, String ownerEmail);

    void shareProject(Long projectId, String collaboratorEmail);

    List<Project> getProjectsByUser(String email);
}