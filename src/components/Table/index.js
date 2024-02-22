import {getDaysAmount} from '../../helpers.js'
import {tableHeadingClasses, tableContentClasses} from './styles-classes.js'

const { dayIndexClasses, tableCategoryClasses, tableRowClasses } = tableHeadingClasses;
const {
  achievedCellClasses, 
  dayCellClasses, 
  dayCellDisabledClasses, 
  deleteButtonClasses, 
  editButtonClasses, 
  goalCellClasses, 
  headingCellClasses, 
  rowCellClasses 
} = tableContentClasses;

export class Table {
  habitsContainer = document.querySelector("#tbody_id");
  habitsHeaderContainer = document.querySelector("#thead_id");

  constructor(habitsData, searchValue = ''){
    this.habitsData = habitsData;
    this.searchValue = searchValue;
    this.render();
    // this.addEventListeners();
  }

  render(){
    this.habitsContainer.innerHTML = '';
    this.habitsHeaderContainer.innerHTML = '';

    const maxDaysAmount = getDaysAmount(this.habitsData);

    this.createTableHeading(maxDaysAmount);
    this.createTableContent(this.habitsData, maxDaysAmount);
  }

  createTableHeading(daysCounter){
    const headingTableRow = document.createElement("tr");
    headingTableRow.classList.add(...tableRowClasses);
  
    // heading habit name
    const headingHabitName = document.createElement("th");
    headingHabitName.classList.add(...tableCategoryClasses);
    headingHabitName.textContent = "Habit";
    headingTableRow.append(headingHabitName);
  
    // habit heading days
    for(let i = 0 ; i<daysCounter; i++){
      const tableHeadingDay = document.createElement("th");
      tableHeadingDay.classList.add(...dayIndexClasses);
      tableHeadingDay.textContent = i + 1;
      headingTableRow.append(tableHeadingDay);
    }
  
    // heading habit goal days number
    const headingHabitGoal = document.createElement("th");
    headingHabitGoal.classList.add(...tableCategoryClasses);
    headingHabitGoal.textContent = "Goal";
    headingTableRow.append(headingHabitGoal);
  
    // heading habit achieved days number
    const headingAchievedGoal = document.createElement("th");
    headingAchievedGoal.classList.add(...tableCategoryClasses);
    headingAchievedGoal.textContent = "Achieved";
    headingTableRow.append(headingAchievedGoal);
  
    this.habitsHeaderContainer.append(headingTableRow);
  }

  createTableContent(habitsData, daysCounter){
    habitsData
    .filter((habit) => habit.title.includes(this.searchValue))
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
      goalCell.classList.add(...goalCellClasses);
      goalCell.textContent = goal;
      tableRow.append(goalCell);
  
      //habit achieved
      const achievedCell = document.createElement("td");
      achievedCell.classList.add(...achievedCellClasses);
      achievedCell.textContent = achieved;
      tableRow.append(achievedCell);
  
      //append habit row into habitsContainer element
      this.habitsContainer.append(tableRow);
    })
  }

}