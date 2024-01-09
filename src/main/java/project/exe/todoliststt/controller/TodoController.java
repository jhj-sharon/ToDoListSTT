package project.exe.todoliststt.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;
import project.exe.todoliststt.model.TodoEntity;
import project.exe.todoliststt.model.TodoRequest;
import project.exe.todoliststt.model.TodoResponse;
import project.exe.todoliststt.service.TodoService;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@AllArgsConstructor
@RestController
@RequestMapping("/todos")
public class TodoController {

    private  final TodoService service;

    @PostMapping
    public ResponseEntity<TodoResponse> create (@RequestBody TodoRequest request){
         if(ObjectUtils.isEmpty(request.getTitle())){
             return ResponseEntity.badRequest().build();
         }
        if(ObjectUtils.isEmpty(request.getOrder())){
            request.setOrder(0L);
        }

        if(ObjectUtils.isEmpty(request.getCompleted())){
            request.setCompleted(false);
        }

        TodoEntity result = this.service.add((request));
        return ResponseEntity.ok(new TodoResponse(result));
    }

    @GetMapping("{id}")
    public ResponseEntity<TodoResponse> readOne(@PathVariable  Long id){
        TodoEntity result = this.service.searchById(id);
        return ResponseEntity.ok(new TodoResponse(result));

    }

    @GetMapping
    public ResponseEntity<List<TodoResponse>> readAll(){
        List<TodoEntity> list = this.service.searchAll();
        List<TodoResponse> response = list.stream().map(TodoResponse::new).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("{id}")
    public ResponseEntity<TodoResponse> update(@PathVariable Long id, @RequestBody TodoRequest request){
        TodoEntity result = this.service.updateById(id, request);
        return ResponseEntity.ok(new TodoResponse(result));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteOne(@PathVariable Long id){
        this.service.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAll(){
        this.service.deleteAll();
        return ResponseEntity.ok().build();
    }

}//end of class
