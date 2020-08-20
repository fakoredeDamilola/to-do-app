const addNote = document.querySelector(".addNote"),
  addInput = document.querySelector(".addInput"),
  notes = document.querySelector(".notes"),
  notDoneNotes = document.querySelector(".notDoneNotes"),
  doneNotes = document.querySelector(".doneNotes");
let toDo = [],
  current,
  value;
(function populateUI() {
  if (localStorage.getItem("toDo") !== null) {
    toDo = JSON.parse(localStorage.getItem("toDo"));
    toDo.forEach((datum) => {
      createNote(datum, (done = datum.done));
    });
  }
})();
function addZero(val) {
  return val > 9 ? val : `0${val}`;
}
function createElement(val) {
  return document.createElement(val);
}
function addNoteToData(value, done = null) {
  let d = new Date(),
    newNote,
    currentItem;
  let mins = addZero(d.getMinutes()),
    hour = addZero(d.getHours()),
    month = addZero(d.getMonth()),
    day = addZero(d.getDate()),
    year = addZero(d.getFullYear()),
    storageItem;
  let time = `${hour} : ${mins}`;
  let date = `${day}/${d.getMonth() + 1}/${year} |`;
  if (done === null || done === false) {
    newNote = {
      id: Math.ceil(Math.random() * 10000),
      date,
      time,
      content: value,
      done: false,
    };
    createNote(newNote, (done = false));
  } else if (done === true) {
    newNote = {
      id: Math.ceil(Math.random() * 10000),
      date,
      time,
      content: value,
      done: true,
    };
    createNote(newNote, (done = true));
  }

  return newNote;
}
function placeNote(value, div5) {
  if (value.done) {
    doneNotes.appendChild(div5);
  } else {
    notDoneNotes.appendChild(div5);
  }
}
function addToStorage(datum = null) {
  if (localStorage.getItem("toDo") === null) {
    toDo = [];
    toDo.push(datum);
    localStorage.setItem("toDo", JSON.stringify(toDo));
  } else {
    toDo = JSON.parse(localStorage.getItem("toDo"));
    toDo.push(datum);
    localStorage.setItem("toDo", JSON.stringify(toDo));
  }
}
function createNote(value, done) {
  let div1 = createElement("section");
  let div2 = createElement("div");
  let div3 = createElement("div");
  let div4 = createElement("div");
  let div5 = createElement("div");
  let div6 = createElement("div");
  let label = createElement("label");
  let span1 = createElement("span");
  let span2 = createElement("span");
  let span3 = createElement("button");
  let span4 = createElement("button");
  let span5 = createElement("div");
  let button = createElement("div");
  span5.appendChild(document.createTextNode("Check if you are done"));
  //button.type = "checkbox";
  button.style.backgroundColor = done ? "green" : "red";
  //button.name = "done";
  button.className = "checkbox";
  label.appendChild(button);
  label.appendChild(span5);
  div6.appendChild(label);
  div6.className = "bottomDiv";

  let trash = createElement("i");
  let pencil = createElement("i");
  pencil.className = "fa fa-pencil";
  trash.className = "fas fa-trash";
  span3.className = "edit";
  span4.className = "delete";
  div5.id = value.id;
  div5.className = "note";
  div3.className = "time";
  div4.className = "content";
  span2.className = "tim";
  span1.appendChild(document.createTextNode(value.date));
  span2.appendChild(document.createTextNode(value.time));
  span3.appendChild(pencil);
  span4.appendChild(trash);
  // span3.appendChild(document.createTextNode("pencil"));
  // span4.appendChild(document.createTextNode("trash"));

  div1.appendChild(span1);
  div1.appendChild(span2);
  div2.appendChild(span3);
  div2.appendChild(span4);
  div3.appendChild(div1);
  div3.appendChild(div2);
  div4.appendChild(document.createTextNode(value.content));
  div5.appendChild(div3);
  div5.appendChild(div4);
  div5.appendChild(div6);

  placeNote(value, div5);

  //return newDiv
}
addNote.addEventListener("click", function (e) {
  e.preventDefault();
  if (addInput.value !== "") {
    if (addNote.value === "submit") {
      value = addInput.value;
      let datum = addNoteToData(value);
      //let newDiv=createNote(value)

      addToStorage(datum);
      addInput.value = "";
    } else if (addNote.value === "edit") {
      console.log(current);
      if (currentItem.done === true) {
        doneNotes.removeChild(current);
      } else if (currentItem.done === false) {
        notDoneNotes.removeChild(current);
      }
      let datum = addNoteToData(addInput.value, currentItem.done);
      toDo.push(datum);
      toDo = toDo.filter((datum) => datum.id != current.id);
      addInput.value = "";
      addNote.value = "submit";

      localStorage.setItem("toDo", JSON.stringify(toDo));
    }
  } else {
    alert("Please input something");
  }
});
notes.addEventListener("click", function (e) {
  if (e.target.className === "fas fa-trash") {
    deleteNote(
      e.target.parentElement.parentElement.parentElement.parentElement
    );
  } else if (e.target.className === "fa fa-pencil") {
    editNote(e.target.parentElement.parentElement.parentElement.parentElement);
  } else if (e.target.className === "checkbox") {
    updateNote(e.target.parentElement.parentElement.parentElement);
  }
});
function deleteNote(child) {
  if (confirm("are you sure you want to delete this")) {
    current = toDo.filter((datum) => datum.id == child.id)[0];
    toDo = toDo.filter((datum) => datum.id != child.id);
    if (current.done === true) {
      doneNotes.removeChild(child);
    } else if (current.done === false) {
      notDoneNotes.removeChild(child);
    }
    localStorage.setItem("toDo", JSON.stringify(toDo));
  }
}
function updateNote(child) {
  current = toDo.filter((datum) => datum.id == child.id)[0];
  toDo = toDo.filter((datum) => datum.id != child.id);
  localStorage.setItem("toDo", JSON.stringify(toDo));
  if (current.done === true) {
    console.log(123);
    doneNotes.removeChild(child);
    let datum = addNoteToData(current.content, false);
    addToStorage(datum);
  } else if (current.done === false) {
    child.childNodes[2].childNodes[0].childNodes[0].checked = true;
    notDoneNotes.removeChild(child);
    let datum = addNoteToData(current.content, true);
    addToStorage(datum);
  }
}
function editNote(child) {
  let item = toDo.filter((datum) => child.id == datum.id)[0];
  current = child;
  currentItem = item;
  addInput.value = item.content;
  addNote.value = "edit";
}

//search input
let searchInput = document.querySelector(".searchInput"),
  toLowerCase,
  info;
searchInput.addEventListener("keyup", function (e) {
  let note = notes.getElementsByClassName("note");
  toLowerCase = e.target.value.toLowerCase();
  Array.from(note).forEach(function (note) {
    // let noteName=note.
    let noteName = note.childNodes[1].textContent;
    if (noteName.toLowerCase().indexOf(toLowerCase) != -1) {
      note.style.display = "block";
    } else {
      note.style.display = "none";
    }
  });
});
