package in.sp.codesync.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FileRequest {

    @NotBlank(message = "File name is required")
    private String fileName;

    @NotBlank(message = "Language is required")
    private String language;

    private String content;

    private Long projectId;
}