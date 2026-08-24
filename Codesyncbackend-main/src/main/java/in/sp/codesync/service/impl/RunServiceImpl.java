package in.sp.codesync.service.impl;

import in.sp.codesync.dto.request.RunRequest;
import in.sp.codesync.dto.response.RunResponse;
import in.sp.codesync.service.RunService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RunServiceImpl implements RunService {

    private final RestTemplate restTemplate;

    private static final String PISTON_URL = "https://emkc.org/api/v2/piston/execute";

    @Override
    public RunResponse runCode(RunRequest request) {

        Map<String, Object> body = new HashMap<>();

        body.put("language", request.getLanguage());

        body.put("version", "*");

        List<Map<String, String>> files = new ArrayList<>();

        Map<String, String> file = new HashMap<>();

        file.put("content", request.getCode());

        files.add(file);

        body.put("files", files);

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                PISTON_URL,
                HttpMethod.POST,
                entity,
                Map.class
        );

        Map run = (Map) response.getBody().get("run");

        String stdout = Objects.toString(run.get("stdout"), "");
        String stderr = Objects.toString(run.get("stderr"), "");
        Integer code = (Integer) run.get("code");

        return new RunResponse(stdout, stderr, code);

    }

}