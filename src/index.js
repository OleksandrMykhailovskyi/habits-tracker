const habitsContainer = document.querySelector("#tbody_id")

const myRow = document.querySelector("#habit-row-0");
const itemCellElements = myRow.getElementsByClassName("habit-day");

const goalAmountCell = document.querySelector("#habit-row-0 .habit-day-goal");
goalAmountCell.innerHTML = itemCellElements.length;

const toggleCellStyles = (cell) => {
    cell.classList.contains("habit-day") && cell.classList.toggle("day_selected")
}

function cellClickHandler (event, cell_id) {
    let achivedCounter = 0;

    toggleCellStyles(event.target)

    for (let element of event.currentTarget.children){
        if(element.classList.contains("day_selected")){
            ++achivedCounter
        }
    }

    const achivedAmountCell = document.querySelector(`#habit-row-${cell_id} .habit-day-achieved`);

    achivedAmountCell.innerText = achivedCounter;
}

