package via.viatab.backend.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import via.viatab.backend.model.Department;

@Data
@NoArgsConstructor
public class StoryDTO {

    private Long id;

    @NotBlank(message = "Headline is required")
    @Size(max = 200, message = "Headline must not exceed 200 characters")
    private String headline;

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Department is required")
    private Department department;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
