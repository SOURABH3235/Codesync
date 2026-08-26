package in.sp.codesync.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CodeExecutionService {

    private final RestTemplate restTemplate;

    private static final String JDOODLE_URL =
            "https://api.jdoodle.com/v1/execute";

    public Map<String, Object> executeCode(
            String language,
            String sourceCode) {

        String clientId = System.getenv("JDOODLE_CLIENT_ID");
        String clientSecret = System.getenv("JDOODLE_CLIENT_SECRET");

        if (clientId == null || clientSecret == null) {
            throw new RuntimeException(
                    "JDoodle credentials are not configured"
            );
        }

        Map<String, String> languageMap = new HashMap<>();

        languageMap.put("javascript", "nodejs");
        languageMap.put("python", "python3");
        languageMap.put("java", "java");
        languageMap.put("cpp", "cpp17");
        languageMap.put("c", "c");

        String jdoodleLanguage =
                languageMap.getOrDefault(
                        language.toLowerCase(),
                        "nodejs"
                );

        Map<String, Object> request = new HashMap<>();

        request.put("clientId", clientId);
        request.put("clientSecret", clientSecret);
        request.put("script", sourceCode);
        request.put("language", jdoodleLanguage);
        request.put("versionIndex", "0");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(request, headers);

        ResponseEntity<Map> response =
                restTemplate.exchange(
                        JDOODLE_URL,
                        HttpMethod.POST,
                        entity,
                        Map.class
                );

        Map<String, Object> result = response.getBody();

        if (result == null) {
            throw new RuntimeException("Empty response from JDoodle");
        }

        Map<String, Object> output = new HashMap<>();

        int statusCode = Integer.parseInt(
                String.valueOf(
                        result.getOrDefault("statusCode", "1")
                )
        );

        output.put("success", statusCode == 200);

        output.put(
                "output",
                result.getOrDefault("output", "No output")
        );

        return output;
    }
}