package in.sp.codesync.repository;

import in.sp.codesync.entity.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {
    // This perfectly fetches messages in order from oldest to newest!
    List<ChatMessageEntity> findByProjectIdOrderByTimestampAsc(Long projectId);
}