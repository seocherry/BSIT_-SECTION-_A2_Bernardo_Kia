const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemList = document.querySelector(".item-list");
const feedback = document.querySelector(".feedback");
const addBtn = document.querySelector("#add-item");
const clearButton = document.querySelector("#clear-list");

const bootstrap = document.head.querySelector(
  "link[href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css']"
);

let todoItems = [];

const handleItem = function (itemName) {
  const items = itemList.querySelectorAll(".item");

  items.forEach((item) => {
    if (
      item.querySelector(".item-name").textContent.trim().toLowerCase() ===
      itemName.trim().toLowerCase()
    ) {
      item
        .querySelector(".complete-item")
        .addEventListener("click", function () {
          let itemText = item.querySelector(".item-name");
          let itemIndex = item.querySelector(".item-index");
          console.log(itemText);
          itemText.classList.toggle("completed");
          itemIndex.classList.toggle("completed");
          
          if (bootstrap) {
            itemText.classList.toggle("text-decoration-line-through");
            itemText.classList.toggle("text-secondary");
            itemIndex.classList.toggle("border-success-subtle");
            itemIndex.classList.toggle("text-secondary");
          }

          if (itemText.classList.contains("completed")) {
            sendFeedback("Item Completed", "success");
          }
        });

      item.querySelector(".edit-item").addEventListener("click", function () {
        addBtn.innerHTML = "Edit Item";
        itemInput.value = itemName;
        itemList.removeChild(item);

        todoItems = todoItems.filter((item) => {
          return item !== itemName;
        });
        setLocalStorage(todoItems);
      });

      item.querySelector(".delete-item").addEventListener("click", function () {
        if (confirm("Are you sure you want to delete this item?")) {
          itemList.removeChild(item);

          todoItems = todoItems.filter(function (item) {
            return item !== itemName;
          });
          setLocalStorage(todoItems);
          sendFeedback("Item deleted", "danger");
        }
      });
    }
  });
};

const getList = function (todoItems) {
  itemList.innerHTML = "";

  todoItems.forEach(function (item, index) {
    if (bootstrap) {
      itemList.insertAdjacentHTML(
        "beforeend",
        `<div class="item my-3 d-flex justify-content-between align-items-center border-bottom border-success-subtle">
          <div class="d-flex gap-1">
            <h6 class="item-index border border-success-subtle rounded p-1">${index}</h6>
            <p class="item-name text-capitalize">${item}</p>
          </div>
          <div class="item-icons">
            <i class="far fa-check-circle complete-item mx-2 item-icon text-success"></i>
            <i class="far fa-edit edit-item mx-2 item-icon text-secondary"></i>
            <i class="far fa-times-circle delete-item item-icon text-danger"></i>
          </div>
      </div>`
      );
    } else {
      itemList.insertAdjacentHTML(
        "beforeend",
        `<div class="item">
            <div class="item-info">
              <h6 class="item-index">
                ${index} 
              </h6>
              <p class="item-name">
                ${item}
              </p>
            </div>
            <div class="item-icons">
              <i class="far fa-check-circle complete-item"></i>
              <i class="far fa-edit edit-item"></i>
              <i class="far fa-times-circle delete-item"></i>
            </div>
          </div>`
      );
    }
    handleItem(item);
  });
};

const getLocalStorage = function () {
  const todoStorage = localStorage.getItem("todoItems");
  if (todoStorage === "undefined" || todoStorage === null) {
    todoItems = [];
  } else {
    todoItems = JSON.parse(todoStorage);
    getList(todoItems);
  }
};

const setLocalStorage = function (todoItems) {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
};

getLocalStorage();

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const itemName = itemInput.value;

  if (itemName.length === 0) {
    sendFeedback("Please Enter Valid Value", "danger");
  } else {
    addBtn.innerHTML = "Add Item";
    todoItems.push(itemName);
    setLocalStorage(todoItems);
    getList(todoItems);
    sendFeedback("Item added to the list", "success");
  }

  itemInput.value = "";
});

clearButton.addEventListener("click", function () {
  confirm("Are you sure you want to clear the list?")
    ? ((todoItems = []), localStorage.clear(), getList(todoItems))
    : null;
});

function sendFeedback(text, className) {
  if (bootstrap) {
    feedback.classList.add("showItem", `alert-${className}`);
    feedback.innerHTML = text;
    setTimeout(function () {
      feedback.classList.remove("showItem", `alert-${className}`);
      feedback.innerHTML = "Write value for item";
    }, 3000);
  } else {
    feedback.classList.add(`${className}`);
    feedback.innerHTML = text;
    setTimeout(function () {
      feedback.classList.remove(`${className}`);
      feedback.innerHTML = "Write value for item";
    }, 3000);
  }
}