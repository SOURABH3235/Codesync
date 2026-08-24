package in.sp.codesync.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodeUpdateMessage {

    private Long projectId;

    private Long fileId;

    private String sender;

    private String content;

}