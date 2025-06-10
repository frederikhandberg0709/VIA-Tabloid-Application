package via.viatab.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import via.viatab.backend.dto.StoryDTO;
import via.viatab.backend.model.Department;
import via.viatab.backend.model.Story;
import via.viatab.backend.repository.StoryRepository;

@Service
public class StoryService {

    @Autowired
    private StoryRepository storyRepository;

    public List<StoryDTO> getAllStories() {
        return storyRepository.findAllOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<StoryDTO> getStoryById(Long id) {
        return storyRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<StoryDTO> getStoriesByDepartment(Department department) {
        return storyRepository.findByDepartmentOrderByCreatedAtDesc(department)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public StoryDTO createStory(StoryDTO storyDTO) {
        Story story = convertToEntity(storyDTO);
        Story savedStory = storyRepository.save(story);
        return convertToDTO(savedStory);
    }

    public Optional<StoryDTO> updateStory(Long id, StoryDTO storyDTO) {
        return storyRepository.findById(id)
                .map(existingStory -> {
                    existingStory.setHeadline(storyDTO.getHeadline());
                    existingStory.setContent(storyDTO.getContent());
                    existingStory.setDepartment(storyDTO.getDepartment());
                    Story updatedStory = storyRepository.save(existingStory);
                    return convertToDTO(updatedStory);
                });
    }

    public boolean deleteStory(Long id) {
        if (storyRepository.existsById(id)) {
            storyRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<StoryDTO> searchStories(String keyword) {
        return storyRepository.findByKeyword(keyword)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private StoryDTO convertToDTO(Story story) {
        StoryDTO dto = new StoryDTO();
        dto.setId(story.getId());
        dto.setHeadline(story.getHeadline());
        dto.setContent(story.getContent());
        dto.setDepartment(story.getDepartment());
        dto.setCreatedAt(story.getCreatedAt());
        dto.setUpdatedAt(story.getUpdatedAt());
        return dto;
    }

    private Story convertToEntity(StoryDTO dto) {
        Story story = new Story();
        story.setHeadline(dto.getHeadline());
        story.setContent(dto.getContent());
        story.setDepartment(dto.getDepartment());
        return story;
    }
}
