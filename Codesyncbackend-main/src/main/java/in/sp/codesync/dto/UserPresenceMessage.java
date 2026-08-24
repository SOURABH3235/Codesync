package in.sp.codesync.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPresenceMessage {

    private Long projectId;

    private String username;

    private String status; // JOIN or LEAVE

}