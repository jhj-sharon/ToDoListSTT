let userInput = document.querySelector(".task-input");
let addButton = document.querySelector(".button-add");
let tabs = document.querySelectorAll(".tab-type div");
let underLine = document.getElementById("tab-underline");
let taskList = [];
let selectedMenu = "tab-all";
let filteredList = [];

addButton.addEventListener("mousedown", addTask);
userInput.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    addTask(event);
  }
});
for (let i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function (event) {
    filter(event);
  });
}

//전체 목록 불러오기
async function fetchTasks() {

  try {
    const response = await fetch("/todos");
    const data = await response.json();
    taskList = data;
    renderTasks();
  } catch (error) {
    console.log("Error fetching tasks: ", error);
  }
}

function addTask() {
  let taskValue = userInput.value;
  let task = {
    title: taskValue,
    completed: false,
  };

  fetch("/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .then((newTask) => {
      taskList.push(newTask);
      userInput.value = "";
      renderTasks();
    })
    .catch((error) => {
      console.error("Error adding task:", error);
    });
}

function renderTasks() {
  let result = "";
  let list = [];

  if (selectedMenu === "tab-all") {
    list = taskList;
  } else if (selectedMenu === "tab-not-done") {
    list = taskList.filter((task) => !task.completed);
  } else if (selectedMenu === "tab-done") {
    list = taskList.filter((task) => task.completed);
  }

  for (let i = 0; i < list.length; i++) {
    const task = list[i];
    const taskClass = task.completed ? "task-done" : "";

    result += `
            <div class="task ${taskClass}" id="${task.id}">
                <span>${task.title}</span>
                <div class="button-box">
                    <button onclick="toggleDone(${task.id})">
                        <i class="${
                          task.completed ? "fas fa-undo-alt" : "fa fa-check"
                        }"></i>
                    </button>
                    <button onclick="deleteTask(${task.id})">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
  }

  document.getElementById("task-board").innerHTML = result;
}

function toggleDone(id) {
  const taskToUpdate = taskList.find((task) => task.id === id);
  if (!taskToUpdate) {
    console.error("Task not found");
    return;
  }

  // 서버에 보낼 업데이트 데이터
  const requestData = {
    title: taskToUpdate.title,
    order: taskToUpdate.order,
    completed: !taskToUpdate.completed,
  };

  fetch(`/todos/${id}`, {
    method: "PATCH", // HTTP 메서드
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((updatedTask) => {
      // 서버에서 업데이트된 데이터 받아와서 UI 업데이트
      taskToUpdate.completed = updatedTask.completed;
      filter(); // 필터 함수를 호출하여 UI 업데이트
    })
    .catch((error) => {
      console.error("Error updating task:", error);
    });
}

function deleteTask(id) {
  fetch(`/todos/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      taskList = taskList.filter((task) => task.id !== id);
      renderTasks();
    })
    .catch((error) => {
      console.error("Error deleting task:", error);
    });
}

function filter(e) {
  console.log("filter 시작");
  if (e) {
    selectedMenu = e.target.id;
    underLine.style.width = e.target.offsetWidth + "px";
    underLine.style.left = e.target.offsetLeft + "px";
    underLine.style.top =
      e.target.offsetTop + (e.target.offsetHeight - 4) + "px";
  }

  filteredList = [];
  if (selectedMenu === "tab-not-done") {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].completed === false) {
        filteredList.push(taskList[i]);
      }
    }
  } else if (selectedMenu === "tab-done") {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].completed) {
        filteredList.push(taskList[i]);
      }
    }
  }
  renderTasks();
}

document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.querySelector(".task-input");
  const buttonSpeak = document.getElementById("button-speak");

  if ("webkitSpeechRecognition" in window) {
    // Speech recognition support. Talk to your apps!
    console.log("음성인식을 지원하는 브라우저입니다.");
    const recognition = new webkitSpeechRecognition();
    recognition.interimResults = true; // 중간 결과를 반환할지 여부
    recognition.lang = "ko-KR";

    recognition.onresult = function (event) {
      console.log(event.results);
      var text = event.results[0][0].transcript;
      console.log(text);
      taskInput.value = text;
      taskInput.focus();

      // 음성으로 '저장' 명령을 인식했을 때 버튼 클릭 이벤트 실행
      if (text.includes("저장")) {
        const addButton = document.querySelector(".button-add");
        addButton.click();
      }
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    buttonSpeak.addEventListener("click", function () {
      recognition.start();
    });

  } else {
    console.log("음성인식 안됨");
  }
});



