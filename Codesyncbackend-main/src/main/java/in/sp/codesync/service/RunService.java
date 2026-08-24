package in.sp.codesync.service;

import in.sp.codesync.dto.request.RunRequest;
import in.sp.codesync.dto.response.RunResponse;

public interface RunService {

    RunResponse runCode(RunRequest request);

}