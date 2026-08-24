package in.sp.codesync.controller;

import in.sp.codesync.dto.request.RunRequest;
import in.sp.codesync.dto.response.RunResponse;
import in.sp.codesync.service.RunService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/run")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RunController {

    private final RunService runService;

    @PostMapping
    public ResponseEntity<RunResponse> runCode(
            @RequestBody RunRequest request) {

        return ResponseEntity.ok(
                runService.runCode(request)
        );

    }

}