package in.sp.codesync.controller;

import in.sp.codesync.dto.ChatMessage;
import in.sp.codesync.entity.ChatMessageEntity;
import in.sp.codesync.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin("*") // Allow frontend to fetch history
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    // 1. WebSocket Endpoint: Save & Broadcast
    @MessageMapping("/workspace/{projectId}/chat")
    @SendTo("/topic/workspace/{projectId}/chat")
    public ChatMessage broadcastMessage(@DestinationVariable Long projectId, ChatMessage chatMessage) {

        chatMessage.setProjectId(projectId);

        // Save to MySQL Database
        ChatMessageEntity entity = new ChatMessageEntity();
        entity.setProjectId(projectId);
        entity.setSender(chatMessage.getSender());
        entity.setMessage(chatMessage.getMessage());
        entity.setTimestamp(LocalDateTime.now());

        chatMessageRepository.save(entity);

        return chatMessage;
    }

    // 2. REST Endpoint: Fetch History
    @GetMapping("/api/projects/{projectId}/chat")
    public List<ChatMessageEntity> getChatHistory(@PathVariable Long projectId) {
        return chatMessageRepository.findByProjectIdOrderByTimestampAsc(projectId);
    }
}