package in.sp.codesync.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RunResponse {

    private String output;

    private String error;

    private Integer exitCode;

}
