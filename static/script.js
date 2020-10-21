window.onload = () => {
  console.log("Page loaded.");
  setInterval(showClock, 1000);

  let todoList = [];
  let doneList = [];

  if (localStorage.getItem("todoList") == null) {
    console.log("[✨] todoList created in localStorage");
    localStorage.setItem("todoList", JSON.stringify([]));
  } else {
    console.log("[✨] todoList fetched from localStorage");
    todoList = JSON.parse(localStorage.getItem("todoList"));
  }

  if (localStorage.getItem("doneList") == null) {
    console.log("[✨] doneList created in localStorage");
    localStorage.setItem("doneList", JSON.stringify([]));
  } else {
    console.log("[✨] doneList fetched from localStorage");
    doneList = JSON.parse(localStorage.getItem("doneList"));
  }

  if (localStorage.getItem("showFinished") == null) {
    console.log("[✨] showFinished status created in localStorage");
    localStorage.setItem("showFinished", false);
  } else {
    console.log("[✨] showFinished status fetched from localStorage");
  }

  if (localStorage.getItem("savedColor") == null) {
    console.log("[✨] savedColor created in localStorage");
    localStorage.setItem("savedColor", "FF9999");
  } else {
    console.log("[✨] savedColor fetched from localStorage");
  }

  load();

  // Socket connection for server rendering
  let socket = io(location.href);

  socket.on("connect", () => {
    console.log("[⚡] Socket connected");
    console.log("todoList: " + localStorage.getItem("todoList"));
    console.log("doneList: " + localStorage.getItem("doneList"));
  });

  socket.on("rendered data", (data) => {
    console.log("[💌] Server response: " + data);
    update(data, "mktodo");
  });

  let colorbar = document.getElementById("color-bar");
  document.getElementById("color-theme-button").onclick = () => {
    colorbar.style.display = "block";
  };

  window.onclick = ({ target }) => {
    if (target == colorbar) {
      colorbar.style.display = "none";
    }
  };

  function loadColor(colorId) {
    let bg = document.getElementsByTagName("body")[0];
    let todolabel = document.getElementById("todo-label");
    let topbar = document.getElementById("top-bar");
    let colorbtn = document.getElementById("color-theme-button");
    let showbtn = document.getElementById("show-finished");

    console.log("[🎨] Color change: " + colorId);

    if (colorId == "FF9999") {
      bg.style.background = "#FFC8C8";
      colorbtn.style.background = "#" + colorId;
      showbtn.style.background = "#" + colorId;
      todolabel.style.color = "#EF7070";
      topbar.style.background = "#" + colorId;
    } else if (colorId == "FFCF87") {
      bg.style.background = "#FFE9C9";
      colorbtn.style.background = "#" + colorId;
      showbtn.style.background = "#" + colorId;
      todolabel.style.color = "#F1B151";
      topbar.style.background = "#" + colorId;
    } else if (colorId == "99DA83") {
      bg.style.background = "#DAF2D1";
      colorbtn.style.background = "#" + colorId;
      showbtn.style.background = "#" + colorId;
      todolabel.style.color = "#7FBD6A";
      topbar.style.background = "#" + colorId;
    } else if (colorId == "93D7E6") {
      bg.style.background = "#D6E7EB";
      colorbtn.style.background = "#" + colorId;
      showbtn.style.background = "#" + colorId;
      todolabel.style.color = "#55A9BB";
      topbar.style.background = "#" + colorId;
    } else if (colorId == "C8A8F2") {
      bg.style.background = "#E1D9EB";
      colorbtn.style.background = "#" + colorId;
      showbtn.style.background = "#" + colorId;
      todolabel.style.color = "#9673C1";
      topbar.style.background = "#" + colorId;
    } else if (colorId == "505050") {
      bg.style.background = "#232323";
      colorbtn.style.background = "#" + colorId;
      showbtn.style.background = "#" + colorId;
      todolabel.style.color = "#FFFFFF";
      topbar.style.background = "#" + colorId;
    }
  }

  document.addEventListener("click", (e) => {
    let colorbtns = [...document.getElementsByClassName("color-themes")];

    let colorId = e.target.id;
    if (!colorbtns.includes(e.target)) return;
    if (colorId.length > 6) {
      colorId = colorId.substring(1);
    }

    loadColor(colorId);

    localStorage.setItem("savedColor", colorId);
  });

  // Adding task
  let taskInput = document.getElementById("task-input");

  document.getElementById("add-task").onclick = () => {
    if (!taskInput.value.trim().length) {
      console.log("[❕] Empty string, aborted.");
    } else {
      console.log("[📮] Sending to server...");
      socket.emit("render todo", taskInput.value);
    }
  };

  taskInput.addEventListener("keyup", ({ key }) => {
    if (key === "Enter") {
      if (!taskInput.value.trim().length) {
        console.log("[❕] Empty string, aborted.");
      } else {
        console.log("[📮] Sending to server...");
        socket.emit("render todo", taskInput.value);
      }
    }
  });

  // Helper update the localstorage and cleanup function
  function update(item, type) {
    switch (type) {
      case "mktodo":
        console.log("[📌] New task: " + item);

        todoList = JSON.parse(localStorage.getItem("todoList"));
        todoList.push(item);
        localStorage.setItem("todoList", JSON.stringify(todoList));
        taskInput.value = "";
        
        newItem(item, "todo",JSON.parse(localStorage.getItem("todoList")).length - 1);
        break;
    }
  }

  // Took a long time, ordering of elements between lists
  function newItem(item, clsname, id) {
    let itemID = id;
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(item));

    let span = document.createElement("span");
    span.className = "delete";
    span.appendChild(document.createTextNode("🗑️"));
    li.appendChild(span);

    switch (clsname) {
      case "todo":
        itemID = id;
        li.className = "todo";
        li.id = itemID;
        span.id = itemID;
        document.getElementById("todo-items").appendChild(li);
        break;
      case "done":
        itemID = id;
        li.className = "done";
        li.id = itemID;
        span.id = itemID;
        document.getElementById("done-items").appendChild(li);

        break;

      default:
        console.log("wth how'd you get here");
        console.log(clsname);
    }

    li.onclick = async () => {
      if (li.className == "todo") {
        let outputRemove = JSON.parse(localStorage.getItem("todoList"));
        let outputAdd = JSON.parse(localStorage.getItem("doneList"));

        outputAdd.push(...outputRemove.splice(li.id, 1));

        localStorage.setItem("todoList", JSON.stringify(outputRemove));
        localStorage.setItem("doneList", JSON.stringify(outputAdd));

        let nodes = li.parentElement.childNodes;

        for (let i = parseInt(li.id); i < nodes.length - 1; i++) {
          console.log("[🔬] Adjusting child node indicies...");
          if (
            nodes[i + 1].nodeName.toLowerCase() == "li" &&
            nodes[i + 1].classList.contains("todo")
          ) {
            nodes[i + 1].lastChild.id = i;
            nodes[i + 1].id = i;
          }
        }

        let newId = outputAdd.length - 1;
        li.id = newId;
        li.lastChild.id = newId;

        li.classList.add("fade-out");
        await new Promise((r) => setTimeout(r, 250));
        document.getElementById("done-items").appendChild(li);
        li.className = "done";
        li.classList.add("fade-in");
        await new Promise((r) => setTimeout(r, 250));
        li.classList.remove("fade-in");
      } else if (li.className == "done") {
        let outputRemove = JSON.parse(localStorage.getItem("doneList"));
        let outputAdd = JSON.parse(localStorage.getItem("todoList"));

        outputAdd.push(...outputRemove.splice(li.id, 1));

        localStorage.setItem("doneList", JSON.stringify(outputRemove));
        localStorage.setItem("todoList", JSON.stringify(outputAdd));

        let nodes = li.parentElement.childNodes;

        for (let i = parseInt(li.id); i < nodes.length - 1; i++) {
          console.log("[🔬] Adjusting child node indicies...");
          if (
            nodes[i + 1].nodeName.toLowerCase() == "li" &&
            nodes[i + 1].classList.contains("done")
          ) {
            nodes[i + 1].lastChild.id = i;
            nodes[i + 1].id = i;
          }
        }

        let newId = outputAdd.length - 1;
        li.id = newId;
        li.lastChild.id = newId;

        li.classList.add("fade-out");
        await new Promise((r) => setTimeout(r, 250));
        document.getElementById("todo-items").appendChild(li);
        li.className = "todo";
        li.classList.add("fade-in");
        await new Promise((r) => setTimeout(r, 250));
        li.classList.remove("fade-in");
      } else {
        console.log("wth, how'd you even get here");
      }
    };

    span.onclick = (ev) => {
      if (span.parentElement.className == "todo") {
        let output = JSON.parse(localStorage.getItem("todoList"));
        output.splice(span.id, 1);
        localStorage.setItem("todoList", JSON.stringify(output));

        console.log(`[🗑️] Todo task delted. ID: ${span.id}. Task: ${item}`);
      } else if (span.parentElement.className == "done") {
        let output = JSON.parse(localStorage.getItem("doneList"));
        output.splice(span.id, 1);
        localStorage.setItem("doneList", JSON.stringify(output));

        console.log(`[🗑️] Done task delted. ID: ${span.id}. Task: ${item}`);
      } else {
        console.log("wtf happened, how'd u even get here");
      }

      let nodes = span.parentElement.parentElement.childNodes;

      for (let i = parseInt(span.id); i < nodes.length - 1; i++) {
        console.log("[🔬] Adjusting child node indicies...");
        if (nodes[i + 1].nodeName.toLowerCase() == "li") {
          nodes[i + 1].lastChild.id = i;
          nodes[i + 1].id = i;
        }
      }

      span.parentElement.remove();
      ev.stopPropagation();
    };
  }

  // Load from localStorage
  function load() {
    let counter = 0;
    for (const i of todoList) {
      newItem(i, "todo", counter);
      counter ++;
    }
    counter = 0;
    for (const j of doneList) {
      newItem(j, "done", counter);
      counter ++;
    }

    if (localStorage.getItem("showFinished") == "true") {
      document.getElementById("done-items").style.display = "inline";
      document.getElementById("show-finished").innerHTML = "🙈";
    } else {
      document.getElementById("done-items").style.display = "none";
      document.getElementById("show-finished").innerHTML = "🙉";
    }

    let colorId = localStorage.getItem("savedColor");
    loadColor(colorId);
  }

  // Finished tasks button
  let show = document.getElementById("show-finished");

  show.onclick = () => {
    console.log("show-finished clicked");

    if (localStorage.getItem("showFinished") == "true") {
      document.getElementById("done-items").style.display = "none";
      show.innerHTML = "🙉";
      localStorage.setItem("showFinished", false);
    } else {
      document.getElementById("done-items").style.display = "inline";
      show.innerHTML = "🙈";
      localStorage.setItem("showFinished", true);
    }
  };

  // Easy access to input bar
  document.addEventListener("keyup", ({ key }) => {
    if (key === "q") {
      taskInput.focus();
    } else if (key === "Escape") {
      taskInput.blur();
    }
  });

  // Clock
  function showClock() {
    let date = new Date();
    let hours = date.getHours();
    let mins = date.getMinutes();
    let merid = "a.m.";

    if (hours >= 12) {
      hours -= 12;
      merid = "p.m.";
    }

    if (hours == 0) {
      hours = 12;
    }

    if (mins < 10) {
      mins = "0" + mins;
    }

    let clockTime = hours + ":" + mins + " " + merid;
    let clock = document.getElementById("clock");

    if (clock.innerHTML != clockTime) {
      clock.innerHTML = clockTime;
    }
  }
};
