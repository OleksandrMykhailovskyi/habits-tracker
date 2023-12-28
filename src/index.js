const habitsContainer = document.querySelector("#tbody_id");
const habitsHeaderContainer = document.querySelector("#thead_id")

const add_form = document.querySelector("#my-form")
const inputs = add_form.elements;
const newHabitNameInput = inputs["name"];
const newHabitGoalInput = inputs["goal"];

const habitsData = JSON.parse(localStorage.getItem("habitsData"));

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

const deleteHabit = (id) => {
    const updatedData = habitsData.filter((habit) => {
        return habit.id !== id
    });

    localStorage.setItem("habitsData", JSON.stringify(updatedData));
}

const getRandomNumber = () => {
    return Math.random().toFixed(4)
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
const deleteButtonClasses = ["btn-delete", "ml-2", "p-2", "text-sm", "text-gray-900", "bg-slate-500"];

// table heading styles arrays
const tableHeadingTableRowClasses = ["divide-x", "divide-gray-200"];
const tableHeadingTableCategoryNameClasses = ["px-4", "py-3.5", "text-left", "text-sm", "font-semibold", "text-purple-800"];
const tableHeadingDayIndexClasses = ["px-4", "py-3.5", "text-left", "text-sm", "font-semibold", "text-gray-900"];

document.addEventListener('DOMContentLoaded', function() {
    // localStorage.setItem("habitsData", JSON.stringify(habitsMock));
    // localStorage.clear();
    let daysCounter = 0;

    habitsData.forEach(({ days }) => {
        if(days.length>daysCounter){
            daysCounter = days.length;
        }
    })

    habitsData.forEach(({days, title, goal, achieved, id}) => {
        //create habit row
        const tableRow = document.createElement("tr");
        tableRow.classList.add(...rowCellClasses);
        tableRow.dataset.index = id;

        //habit heading
        const rowHeading = document.createElement("td");
        rowHeading.classList.add(...headingCellClasses);
        rowHeading.textContent = title;

        //delete button create
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

    // heading habit goal number
    const headingHabitGoal = document.createElement("th");
    headingHabitGoal.classList.add(...tableHeadingTableCategoryNameClasses);
    headingHabitGoal.textContent = "Goal";
    headingTableRow.append(headingHabitGoal);

    // heading habit goal number
    const headingAchievedGoal = document.createElement("th");
    headingAchievedGoal.classList.add(...tableHeadingTableCategoryNameClasses);
    headingAchievedGoal.textContent = "Achieved";
    headingTableRow.append(headingAchievedGoal);

    habitsHeaderContainer.append(headingTableRow);
});

habitsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("btn-delete")){
        //TODO needs improvement
        const selectedRow = event.target.parentNode.parentNode;
        const rowId = selectedRow.dataset.index;
        deleteHabit(+rowId);
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
