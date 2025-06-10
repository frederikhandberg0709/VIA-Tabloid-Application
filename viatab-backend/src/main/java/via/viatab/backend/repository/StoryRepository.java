package via.viatab.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import via.viatab.backend.model.Department;
import via.viatab.backend.model.Story;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {

    List<Story> findByDepartment(Department department);

    @Query("SELECT s FROM Story s ORDER BY s.createdAt DESC")
    List<Story> findAllOrderByCreatedAtDesc();

    @Query("SELECT s FROM Story s WHERE s.department = :department ORDER BY s.createdAt DESC")
    List<Story> findByDepartmentOrderByCreatedAtDesc(Department department);

    @Query("SELECT s FROM Story s WHERE LOWER(s.headline) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.content) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Story> findByKeyword(String keyword);
}
