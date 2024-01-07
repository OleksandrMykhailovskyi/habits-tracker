const habitsContainer = document.querySelector("#tbody_id");
const habitsHeaderContainer = document.querySelector("#thead_id");
const habitsTable = document.querySelector("#habits-table-id");
const noHabitsComponent = document.querySelector("#no-habits-id");
const modalOuter = document.querySelector("#modal-outer-id");
const modalInner = document.querySelector("#modal-inner-id");
const contentContainer = document.querySelector("#content-section-id");
const searchInput = document.querySelector("#search-input-id");

const sortByTitleButton = document.querySelector("#sort-by-title");
const sortByGoalButton = document.querySelector("#sort-by-goal");
const sortByAchievedButton = document.querySelector("#sort-by-achieved");


const add_form = document.querySelector("#my-form");
const inputs = add_form.elements;
const newHabitNameInput = inputs["name"];
const newHabitGoalInput = inputs["goal"];

const habitsData = JSON.parse(localStorage.getItem("habitsData"));

// search field default value
let searchValue = '';

// the function that creates the array of days
const getNewDaysArray = (daysNum) => {
    const resObj = [];

    for(let i = 0; i<daysNum; i++){
        resObj.push({
            checked: false
        })
    }

    return resObj;
}

// if there are no habits added - show no habits message
if(habitsData.length===0){
    habitsTable.classList.toggle("hidden");
    noHabitsComponent.classList.toggle("hidden")
}

const deleteHabit = ({id, habitsList}) => habitsList.filter((habit) => habit.id !== id);

const editHabitTitle = ({id, habitsList, newTitle}) => habitsList.map((habit) => {
    if (habit.id === id) {
        return { ...habit, title: newTitle };
    }
    return habit;
});

const getRandomNumber = () => {
    return Math.random().toFixed(4)
}

const handleModalToggle = () => {
    modalOuter.classList.toggle("!block");
}

const handleModalClose = () => {
    modalInner.innerHTML = '';
    handleModalToggle();
}

// search field handler for onChange
searchInput.addEventListener("change", (e) => {
    searchValue = e.target.value;
    createTable(habitsData, searchValue)
})

// this handler checks whether the click has occurred out of modal. And if yes - close the modal
window.onclick = function(event) {
    if (event.target == modalOuter) {
        handleModalClose();
    }
}

// TODO: improve the way the data is updated. Here is a handler to reload the page
document.addEventListener('page-reload', function () {
    window.location.reload();
});

const pageReload = new Event('page-reload');

const createDeleteHabitForm = (habitId) => {
    handleModalToggle();

    const deleteHabitContainer = document.createElement("div");
    const questionBeforeDelete = document.createElement("p");
    questionBeforeDelete.textContent = "Do you want to delete a habit?";
    // delete buttons modal container
    const buttonsContainer = document.createElement("div");
    // cancel delete button
    const cancelDeleteButton = document.createElement("button");
    cancelDeleteButton.setAttribute("id", "delete-cancel-btn");
    cancelDeleteButton.setAttribute("type", "cancel");
    cancelDeleteButton.textContent = "No";
    // confirm delete button
    const confirmDeleteButton = document.createElement("button");
    confirmDeleteButton.setAttribute("id", "delete-submit-btn");
    confirmDeleteButton.setAttribute("type", "submit");
    confirmDeleteButton.textContent = "Yes";
    // add buttons inside the container
    buttonsContainer.appendChild(cancelDeleteButton);
    buttonsContainer.appendChild(confirmDeleteButton);
    // add the elements inside a main container
    deleteHabitContainer.appendChild(questionBeforeDelete);
    deleteHabitContainer.appendChild(buttonsContainer);
    // add delete habit to modal
    modalInner.appendChild(deleteHabitContainer);

    cancelDeleteButton.addEventListener("click", handleModalClose);

    confirmDeleteButton.addEventListener("click", function (e) {
        const updatedData = deleteHabit({id: +habitId, habitsList: habitsData});
        localStorage.setItem("habitsData", JSON.stringify(updatedData));

        document.dispatchEvent(pageReload);

        handleModalClose();
    });
}

const createEditHabitForm = (habitId) => {
    handleModalToggle();

    const habitTitle = habitsData.find((habit) => habit.id === habitId).title;
    const editForm = document.createElement("form");
    editForm.setAttribute("id", "edit-habit-form");
    // create edit title input
    const editTitleInput = document.createElement("input");
    editTitleInput.setAttribute("placeholder", "Please fill in a new title");
    editTitleInput.setAttribute("name", "title");
    editTitleInput.setAttribute("value", habitTitle);
    editTitleInput.classList.add(...inputClasses);
    // create edit button
    const editTitleButton = document.createElement("input");
    editTitleButton.setAttribute("id", "edit-title-btn");
    editTitleButton.setAttribute("type", "submit");
    editTitleButton.setAttribute("value", "Submit");
    // add the elements inside a form
    editForm.appendChild(editTitleInput);
    editForm.appendChild(editTitleButton);
    // add edit habit form to modal
    modalInner.appendChild(editForm);

    editForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const newTitle = editForm.elements["title"].value;
        const updatedHabitsData = editHabitTitle({id: habitId, habitsList: habitsData, newTitle: newTitle});

        localStorage.setItem("habitsData", JSON.stringify(updatedHabitsData));

        document.dispatchEvent(pageReload);
        
        editForm.remove();
        handleModalToggle();
    });
}

add_form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newHabitPayload = {
        title: newHabitNameInput.value,
        goal: +newHabitGoalInput.value,
        achieved: 0,
        days: getNewDaysArray(+newHabitGoalInput.value),
        id: +getRandomNumber()
    }

    const updatedHabitsData = [
        ...habitsData,
        newHabitPayload
    ]

    localStorage.setItem("habitsData", JSON.stringify(updatedHabitsData));

    document.dispatchEvent(pageReload);
});

const toggleCellStyles = (cell) => {
    if(cell.classList.contains("habit-day")){
        cell.classList.toggle("day_selected")
        if(cell.dataset.isChecked==="true"){
            cell.dataset.isChecked = false
        }
        else{
            cell.dataset.isChecked = true
        }
    }        
}

const sortByTitle = () => {
    habitsData.sort((a, b) => a.title.localeCompare(b.title));
    createTable(habitsData, '')
}

const sortByGoal = () => {
    habitsData.sort((a, b) => b.goal - a.goal);
    createTable(habitsData, '')
}

const sortByAchieved = () => {
    habitsData.sort((a, b) => b.achieved / b.goal - a.achieved / a.goal);
    createTable(habitsData, '')
}

sortByTitleButton.addEventListener("click", sortByTitle);
sortByGoalButton.addEventListener("click", sortByGoal);
sortByAchievedButton.addEventListener("click", sortByAchieved);

// const habitsMock = [
// 	{
//         title: 'Read 30 mins/1 day 1',
//         goal: 10,
//         achieved: 0,
//         id: 0,
//         days: [
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//         ] 
//     }, 
//     {
//         title: 'Go running every day 1',
//         goal: 10,
//         achieved: 0,
//         id: 1,
//         days: [
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//             {
//                 checked: false
//             },
//         ],
//     }
// ]

// styles arrays
const rowCellClasses = ["divide-x", "divide-gray-200"];
const headingCellClasses = ["habit-heading", "whitespace-nowrap", "p-4", "text-sm", "font-medium", "text-gray-900"];
const dayCellClasses = ["habit-day",  "whitespace-nowrap", "p-4", "text-sm"];
const dayCellDisabledClasses = ["whitespace-nowrap", "p-4", "text-sm", "bg-slate-100"];
const goalCellStyles = ["habit-day-goal", "whitespace-nowrap", "p-4", "text-sm", "text-gray-900"];
const achievedCellStyles = ["habit-day-achieved", "whitespace-nowrap", "p-4", "text-sm", "text-gray-900"];
const deleteButtonClasses = ["btn-delete", "ml-2", "p-2", "text-sm", "text-slate-200", "bg-slate-500", "rounded"];
const editButtonClasses = ["btn-edit", "ml-2", "p-2", "text-sm", "text-slate-200", "bg-slate-500", "rounded"];
const inputClasses = ["text-black", "border"];

// table heading styles arrays
const tableHeadingTableRowClasses = ["divide-x", "divide-gray-200"];
const tableHeadingTableCategoryNameClasses = ["px-4", "py-3.5", "text-left", "text-sm", "font-semibold", "text-purple-800"];
const tableHeadingDayIndexClasses = ["px-4", "py-3.5", "text-left", "text-sm", "font-semibold", "text-gray-900"];

console.log(habitsData, 'habitsData')

const getDaysAmount = (habitsData) => {
    let daysCounter = 0;

    //the biggest habit goal in days
    habitsData.forEach(({ days }) => {
        if(days.length>daysCounter){
            daysCounter = days.length;
        }
    })

    return daysCounter;
}

const createTableHeading = (daysCounter) => {
    const headingTableRow = document.createElement("tr");
    headingTableRow.classList.add(...tableHeadingTableRowClasses);

    // heading habit name
    const headingHabitName = document.createElement("th");
    headingHabitName.classList.add(...tableHeadingTableCategoryNameClasses);
    headingHabitName.textContent = "Habit";
    headingTableRow.append(headingHabitName);

    // habit heading days
    for(let i = 0 ; i<daysCounter; i++){
        const tableHeadingDay = document.createElement("th");
        tableHeadingDay.classList.add(...tableHeadingDayIndexClasses);
        tableHeadingDay.textContent = i + 1;
        headingTableRow.append(tableHeadingDay);
    }

    // heading habit goal days number
    const headingHabitGoal = document.createElement("th");
    headingHabitGoal.classList.add(...tableHeadingTableCategoryNameClasses);
    headingHabitGoal.textContent = "Goal";
    headingTableRow.append(headingHabitGoal);

    // heading habit achieved days number
    const headingAchievedGoal = document.createElement("th");
    headingAchievedGoal.classList.add(...tableHeadingTableCategoryNameClasses);
    headingAchievedGoal.textContent = "Achieved";
    headingTableRow.append(headingAchievedGoal);

    habitsHeaderContainer.append(headingTableRow);
}

const createTableContent = (habitsData, daysCounter) => {
    habitsData
    .filter((habit) => habit.title.includes(searchValue))
    .forEach(({days, title, goal, achieved, id}) => {
        //create habit row
        const tableRow = document.createElement("tr");
        tableRow.classList.add(...rowCellClasses);
        tableRow.dataset.index = id;

        //habit heading
        const rowHeading = document.createElement("td");
        rowHeading.classList.add(...headingCellClasses);
        rowHeading.textContent = title;

        //edit Habit button
        const editButton = document.createElement("button");
        editButton.classList.add(...editButtonClasses);
        editButton.textContent = 'Edit title';
        rowHeading.append(editButton);

        //delete Habit button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add(...deleteButtonClasses);
        deleteButton.textContent = 'Delete';
        rowHeading.append(deleteButton);

        tableRow.append(rowHeading);

        //habit days
        days.forEach((item, index) => {
            const tableCell = document.createElement("td");
            tableCell.classList.add(...dayCellClasses);
            tableCell.dataset.isChecked = item.checked;
            item.checked && tableCell.classList.add("day_selected");
            tableRow.append(tableCell);
            if(days.length-1 === index && index<daysCounter){
                for(let j = 0; j < daysCounter - index-1; j++){
                    const tableCellDisabled = document.createElement("td");
                    tableCellDisabled.classList.add(...dayCellDisabledClasses);
                    tableRow.append(tableCellDisabled);
                }
            }
        });

        //habit goal
        const goalCell = document.createElement("td");
        goalCell.classList.add(...goalCellStyles);
        goalCell.textContent = goal;
        tableRow.append(goalCell);

        //habit achieved
        const achievedCell = document.createElement("td");
        achievedCell.classList.add(...achievedCellStyles);
        achievedCell.textContent = achieved;
        tableRow.append(achievedCell);

        //append habit row into habitsContainer element
        habitsContainer.append(tableRow);
    })
}

const createTable = (habitsData) => {
    // localStorage.setItem("habitsData", JSON.stringify(habitsMock));
    // localStorage.clear();

    habitsContainer.innerHTML = '';
    habitsHeaderContainer.innerHTML = '';

    const maxDaysAmount = getDaysAmount(habitsData);

    createTableHeading(maxDaysAmount);

    createTableContent(habitsData, maxDaysAmount);
}

document.addEventListener('DOMContentLoaded', function() {
    createTable(habitsData);
});

habitsContainer.addEventListener("click", function(event){
    const selectedRow = event.target.closest("tr");
    const rowId = selectedRow.dataset.index;

    if(event.target.classList.contains("btn-delete")){
        createDeleteHabitForm(+rowId);
    }
    if(event.target.classList.contains("btn-edit")){
        createEditHabitForm(+rowId);
    }
    if(event.target.tagName === "TD"){
        let achivedCounter = 0;

        const selectedRow = event.target.parentNode;

        const rowId = selectedRow.dataset.index;

        const selectedAchievedCell = selectedRow.querySelector(".habit-day-achieved")
        
        toggleCellStyles(event.target);

        const habitDays = selectedRow.querySelectorAll(".habit-day");

        for (let i = 0; i < habitDays.length; i++){
            //TODO: refactor it
            if(habitDays[i].dataset.isChecked === "true"){
                ++achivedCounter;
                habitsData.find((habit) => habit.id === +rowId).days[i].checked = true;
            }else{
                habitsData.find((habit) => habit.id === +rowId).days[i].checked = false;
            }
        }

        const achievedData = habitsData.map((habit)=> {
            if(+rowId === habit.id){
                return {
                    ...habit,
                    achieved: achivedCounter,
                }
            }
            return habit;
        })

        selectedAchievedCell.textContent = achivedCounter;

        localStorage.setItem("habitsData", JSON.stringify(achievedData))

    }
});
