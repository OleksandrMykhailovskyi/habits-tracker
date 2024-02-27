import { DeleteHabitForm } from './components/DeleteHabitForm/index.js';
import { EditHabitForm } from './components/EditHabitForm/index.js';
import { Table } from './components/Table/index.js';
import { getNewDaysArray, getHabitId } from './helpers.js'

const habitsContainer = document.querySelector("#tbody_id");
const habitsTable = document.querySelector("#habits-table-id");
const noHabitsComponent = document.querySelector("#no-habits-id");
const modalOuter = document.querySelector("#modal-outer-id");
const modalInner = document.querySelector("#modal-inner-id");
const searchInput = document.querySelector("#search-input-id");

const sortByTitleButton = document.querySelector("#sort-by-title");
const sortByGoalButton = document.querySelector("#sort-by-goal");
const sortByAchievedButton = document.querySelector("#sort-by-achieved");

const add_form = document.querySelector("#my-form");
const inputs = add_form.elements;
const newHabitNameInput = inputs["name"];
const newHabitGoalInput = inputs["goal"];

// if there is no habitsData array in local storage - create it
if(!localStorage.getItem("habitsData")){
  localStorage.setItem("habitsData", JSON.stringify([]));
}

const habitsData = JSON.parse(localStorage.getItem("habitsData"));

// if there are no habits added - show no habits message
if(habitsData.length===0){
    habitsTable.classList.toggle("hidden");
    noHabitsComponent.classList.toggle("hidden")
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
  new Table(habitsData, e.target.value)
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

add_form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newHabitPayload = {
    title: newHabitNameInput.value,
    goal: +newHabitGoalInput.value,
    achieved: 0,
    days: getNewDaysArray(+newHabitGoalInput.value),
    id: getHabitId()
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
  new Table(habitsData)
}

const sortByGoal = () => {
  habitsData.sort((a, b) => b.goal - a.goal);
  new Table(habitsData)
}

const sortByAchieved = () => {
  habitsData.sort((a, b) => b.achieved / b.goal - a.achieved / a.goal);
  new Table(habitsData)
}

sortByTitleButton.addEventListener("click", sortByTitle);
sortByGoalButton.addEventListener("click", sortByGoal);
sortByAchievedButton.addEventListener("click", sortByAchieved);


const handleDayCellClick = (event, rowId, selectedRow) => {
    let achievedCounter = 0;

    const selectedAchievedCell = selectedRow.querySelector(".habit-day-achieved")
    const habitDays = selectedRow.querySelectorAll(".habit-day");
    
    toggleCellStyles(event.target);

    const updatedData = JSON.parse(localStorage.getItem("habitsData"))

    for (let i = 0; i < habitDays.length; i++){
        //TODO: refactor it
        if(habitDays[i].dataset.isChecked === "true"){
            ++achievedCounter;
            updatedData.find((habit) => habit.id === +rowId).days[i].checked = true;
        }else{
            updatedData.find((habit) => habit.id === +rowId).days[i].checked = false;
        }
    }

    const achievedData = updatedData.map((habit)=> {
        if(+rowId === habit.id){
            return {
                ...habit,
                achieved: achievedCounter,
            }
        }
        return habit;
    })

    selectedAchievedCell.textContent = achievedCounter;

    localStorage.setItem("habitsData", JSON.stringify(achievedData))
}

// should be fixed
document.addEventListener('DOMContentLoaded', function() {
    new Table(habitsData)
});

habitsContainer.addEventListener("click", function(event){
  const selectedRow = event.target.closest("tr");
  const rowId = selectedRow.dataset.index;

  if(event.target.closest('.btn-delete')){
      handleModalToggle();
      const deleteHabitForm = new DeleteHabitForm(+rowId);
      modalInner.append(deleteHabitForm.elem);

      deleteHabitForm.elem.addEventListener('habit-deleted', (event) => {
        console.log(`Habit with id "${event.detail.id}" is deleted.`);
        document.dispatchEvent(pageReload);
        handleModalClose();
      });
      deleteHabitForm.elem.addEventListener('habit-delete-cancel', () => {
          handleModalClose();
      });
  }

  if(event.target.closest('.btn-edit')){
    handleModalToggle();
    const editHabitForm = new EditHabitForm(+rowId);
    modalInner.append(editHabitForm.elem);

    editHabitForm.elem.addEventListener('habit-updated', (event) => {
      console.log(`Habit with id "${event.detail.id}" updated. New title is "${event.detail.title}"`);
      document.dispatchEvent(pageReload);
      editHabitForm.close();
      handleModalToggle();
    }, { once: true });

  }
  
  if(event.target.closest('.habit-day')){
      handleDayCellClick(event, rowId, selectedRow);
  }
});
