package in.sp.codesync.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CursorMessage {

    private Long projectId;

    private Long fileId;

    private String username;

    private int lineNumber;

    private int column;
    private String color;

}