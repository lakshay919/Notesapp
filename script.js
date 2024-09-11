const addBtn = document.querySelector(".addbtn");
const closeForm = document.querySelector(".close-btn");
const blurBackground = document.querySelector(".Blur-container");
const deleteAllNote = document.querySelector(".deleteAllBtn");
const form = document.querySelector(".form-box");
const formBox = document.querySelector("form");
const notePriorities = document.querySelector(".note-Priorities");
const noteBox = document.querySelector(".notesContainer");
const searchInput = document.querySelector("#searchInput");
let editIndex = null;

addBtn.addEventListener("click", () => {
    form.classList.add("showform");
    blurBackground.classList.add("blur")
});

formBox.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    const textarea = e.target.textarea.value;
    const priorities = e.target.priorities.value;
    const noteColor = e.target.color.value;
    console.log(noteColor);

    const months = [
        "Jan", "Feb", "March", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    let currentDates = new Date();
    let dates = currentDates.getDate();
    let month = currentDates.getMonth();
    let monthsInWords = months[month];
    let year = currentDates.getFullYear();

    console.log(monthsInWords);

    if (text === "" || textarea === "") {
        alert("Both heading and notes required for creating he notes");
        return
    };

    let noteData = JSON.parse(localStorage.getItem("notesDetails")) || [];

    if (editIndex === null) {
        noteData.push({ text, textarea, priorities, dates, monthsInWords, year, noteColor });
    } else {
        noteData[editIndex] = { text, textarea, priorities, dates, monthsInWords, year, noteColor };
        editIndex = null;
    }

    localStorage.setItem("notesDetails", JSON.stringify(noteData));
    showNotes();
    form.classList.remove("showform");
    blurBackground.classList.remove("blur")

    formBox.reset();
});

closeForm.addEventListener("click", (e) => {
    e.preventDefault();
    form.classList.remove("showform")
    blurBackground.classList.remove("blur")
    formBox.reset();
})

const showNotes = () => {
    let noteData = JSON.parse(localStorage.getItem("notesDetails")) || [];
    let searchQuery = searchInput.value.toLowerCase();
    let prioritiesSearchQuery = notePriorities.value.toLowerCase();
    console.log(prioritiesSearchQuery);
    let noteShow = "";

    noteData.forEach((element, index) => {
        let matchesSearchQuery = element.text.toLowerCase().includes(searchQuery);
        let matchesPriorityQuery = (prioritiesSearchQuery === "" || element.priorities.toLowerCase().includes(prioritiesSearchQuery));

        if (matchesSearchQuery && matchesPriorityQuery) {
            let prioritiesStyle = "";
            if (element.priorities === "primary") {
                prioritiesStyle = "background-color: #FF0000; color: white;";
            } 
            if (element.priorities === "secondery") {
                prioritiesStyle = "background-color: #ccd900; color: #fff;";
            }
            if (element.priorities === "tertiary"){
                prioritiesStyle = "background-color: green; color: white;";
            }

            noteShow += ` <div class="notes">
                <div class="prioritiesValue" style="${prioritiesStyle}">${element.priorities}</div>
                <h2 class="h2" style="background-color:${element.noteColor}";>${element.text}</h2>
                <p>${element.textarea}</p>
                <div class="btn-date" style="background-color:${element.noteColor}";>
                    <div>
                        <button onclick="editBtn(${index})" style="background-color: #fff; color:#000;"><i class="fa-solid fa-edit"></i></button>
                        <button onclick="deleteBtn(${index})" style="background-color: #000; border: 1px solid #fff; padding: 7px 19px;"><i class="fa-solid fa-trash"></i></button>
                    </div>
                    <div class="date">
                        <span class="current-date">${element.dates} -</span>
                        <span class="current-month">${element.monthsInWords} -</span>
                        <span class="current-year">${element.year}</span>
                    </div>
                </div>
            </div>`;
        }
    });

    noteBox.innerHTML = noteShow;
};


function deleteBtn(i) {
    let noteData = JSON.parse(localStorage.getItem("notesDetails")) || [];
    noteData.splice(i, 1);
    localStorage.setItem("notesDetails", JSON.stringify(noteData));
    showNotes();
}

function editBtn(i) {
    let noteData = JSON.parse(localStorage.getItem("notesDetails")) || [];
    const note = noteData[i];

    formBox.text.value = note.text;
    formBox.textarea.value = note.textarea;
    formBox.priorities.value = note.priorities

    editIndex = i;

    form.classList.add("showform")
    blurBackground.classList.add("blur")
}

deleteAllNote.addEventListener("click", () => {
    localStorage.removeItem("notesDetails");
    showNotes();
});

searchInput.addEventListener("input", showNotes);
notePriorities.addEventListener("change", showNotes)

showNotes();
