package in.sp.codesync.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "chat_messages")
public class ChatMessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long projectId;
    private String sender;
    private String message;

    // Automatically save the exact time the message was sent
    private LocalDateTime timestamp = LocalDateTime.now();
}