package in.sp.codesync.controller;

import in.sp.codesync.dto.ChatMessage;
import in.sp.codesync.dto.CodeUpdateMessage;
import in.sp.codesync.dto.CursorMessage;
import in.sp.codesync.dto.UserPresenceMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class CollaborationController {

    private final SimpMessagingTemplate messagingTemplate;

    // ==========================
    // Live Code Collaboration
    // ==========================

    @MessageMapping("/code")
    public void codeUpdate(@Payload CodeUpdateMessage message) {

        messagingTemplate.convertAndSend(
                "/topic/workspace/" + message.getProjectId(),
                message
        );

    }

    // ==========================
    // Chat
    // ==========================

    @MessageMapping("/chat")
    public void chat(@Payload ChatMessage message) {

        messagingTemplate.convertAndSend(
                "/topic/chat/" + message.getProjectId(),
                message
        );

    }

    // ==========================
    // User Join / Leave
    // ==========================

    @MessageMapping("/presence")
    public void presence(@Payload UserPresenceMessage message) {

        messagingTemplate.convertAndSend(
                "/topic/presence/" + message.getProjectId(),
                message
        );

    }
    @MessageMapping("/cursor")
    public void cursorUpdate(
            @Payload CursorMessage message) {

        System.out.println(
                "CURSOR RECEIVED: "
                        + message.getUsername()
                        + " line="
                        + message.getLineNumber()
                        + " column="
                        + message.getColumn()
        );

        messagingTemplate.convertAndSend(
                "/topic/cursor/"
                        + message.getProjectId(),
                message
        );
    }

}