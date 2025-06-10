package via.viatab.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import via.viatab.backend.dto.StoryDTO;
import via.viatab.backend.model.Department;
import via.viatab.backend.service.StoryService;

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    @Autowired
    private StoryService storyService;

    @GetMapping
    public ResponseEntity<List<StoryDTO>> getAllStories() {
        List<StoryDTO> stories = storyService.getAllStories();
        return ResponseEntity.ok(stories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoryDTO> getStoryById(@PathVariable Long id) {
        Optional<StoryDTO> story = storyService.getStoryById(id);
        return story.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<StoryDTO>> getStoriesByDepartment(@PathVariable Department department) {
        List<StoryDTO> stories = storyService.getStoriesByDepartment(department);
        return ResponseEntity.ok(stories);
    }

    @PostMapping
    public ResponseEntity<StoryDTO> createStory(@Valid @RequestBody StoryDTO storyDTO) {
        StoryDTO createdStory = storyService.createStory(storyDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoryDTO> updateStory(@PathVariable Long id, @Valid @RequestBody StoryDTO storyDTO) {
        Optional<StoryDTO> updatedStory = storyService.updateStory(id, storyDTO);
        return updatedStory.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStory(@PathVariable Long id) {
        boolean deleted = storyService.deleteStory(id);
        return deleted ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<StoryDTO>> searchStories(@RequestParam String keyword) {
        List<StoryDTO> stories = storyService.searchStories(keyword);
        return ResponseEntity.ok(stories);
    }

    @GetMapping("/departments")
    public ResponseEntity<Department[]> getAllDepartments() {
        return ResponseEntity.ok(Department.values());
    }
}
