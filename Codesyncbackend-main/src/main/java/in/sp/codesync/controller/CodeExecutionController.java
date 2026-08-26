package in.sp.codesync.controller;

import in.sp.codesync.service.CodeExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/code")
@RequiredArgsConstructor
public class CodeExecutionController {

    private final CodeExecutionService codeExecutionService;

    @PostMapping("/execute")
    public ResponseEntity<Map<String, Object>> executeCode(
            @RequestBody Map<String, String> request) {

        String language = request.get("language");
        String sourceCode = request.get("sourceCode");

        if (language == null || sourceCode == null) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "output", "Language and sourceCode are required"
                    )
            );
        }

        try {
            Map<String, Object> result =
                    codeExecutionService.executeCode(
                            language,
                            sourceCode
                    );

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of(
                            "success", false,
                            "output", "Code execution failed: " + e.getMessage()
                    )
            );
        }
    }
}