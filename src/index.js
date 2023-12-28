const habitsContainer = document.querySelector("#tbody_id")

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
const goalCellStyles = ["habit-day-goal", "whitespace-nowrap", "p-4", "text-sm", "text-gray-900"];
const achievedCellStyles = ["habit-day-achieved", "whitespace-nowrap", "p-4", "text-sm", "text-gray-900"];
const deleteButtonClasses = ["btn-delete", "ml-2", "p-2", "text-sm", "text-gray-900", "bg-slate-500"];

document.addEventListener('DOMContentLoaded', function() {
    // localStorage.setItem("habitsData", JSON.stringify(habitsMock));
    // localStorage.clear()
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
        days.forEach((item) => {
            const tableCell = document.createElement("td");
            tableCell.classList.add(...dayCellClasses);
            tableCell.dataset.isChecked = item.checked;
            item.checked && tableCell.classList.add("day_selected")
            tableRow.append(tableCell);
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
            if(habitDays[i].dataset.isChecked === "true"){
                ++achivedCounter;
                habitsData[rowId].days[i].checked = true;
            }else{
                habitsData[rowId].days[i].checked = false;
            }
        }

        const achievedData = habitsData.map((habit, index)=> {
            if(+rowId === index){
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
