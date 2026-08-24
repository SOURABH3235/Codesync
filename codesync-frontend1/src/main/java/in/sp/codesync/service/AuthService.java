package in.sp.codesync.service;

import in.sp.codesync.dto.request.LoginRequest;
import in.sp.codesync.dto.request.RegisterRequest;
import in.sp.codesync.dto.reponse.AuthResponse;

public interface AuthService {

    String register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}