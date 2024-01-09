package project.exe.todoliststt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.exe.todoliststt.model.TodoEntity;

public interface TodoRepository extends JpaRepository<TodoEntity, Long> {

}
