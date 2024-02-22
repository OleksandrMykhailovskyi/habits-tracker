import {getDaysAmount} from '../../helpers.js'

export class Table {
  tableHeadingTableRowClasses = ["divide-x", "divide-gray-200"];
  tableHeadingTableCategoryNameClasses = ["px-4", "py-3.5", "text-left", "text-sm", "font-semibold", "text-purple-800"];
  tableHeadingDayIndexClasses = ["px-4", "py-3.5", "text-left", "text-sm", "font-semibold", "text-gray-900"];

  // styles arrays
  rowCellClasses = ["divide-x", "divide-gray-200"];
  headingCellClasses = ["habit-heading", "whitespace-nowrap", "p-4", "text-sm", "font-medium", "text-gray-900"];
  dayCellClasses = ["habit-day",  "whitespace-nowrap", "p-4", "text-sm"];
  dayCellDisabledClasses = ["whitespace-nowrap", "p-4", "text-sm", "bg-slate-100"];
  goalCellStyles = ["habit-day-goal", "whitespace-nowrap", "p-4", "text-sm", "text-gray-900"];
  achievedCellStyles = ["habit-day-achieved", "whitespace-nowrap", "p-4", "text-sm", "text-gray-900"];
  deleteButtonClasses = ["btn-delete", "ml-2", "p-2", "text-sm", "text-slate-200", "bg-slate-500", "rounded"];
  editButtonClasses = ["btn-edit", "ml-2", "p-2", "text-sm", "text-slate-200", "bg-slate-500", "rounded"];

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
    headingTableRow.classList.add(...this.tableHeadingTableRowClasses);
  
    // heading habit name
    const headingHabitName = document.createElement("th");
    headingHabitName.classList.add(...this.tableHeadingTableCategoryNameClasses);
    headingHabitName.textContent = "Habit";
    headingTableRow.append(headingHabitName);
  
    // habit heading days
    for(let i = 0 ; i<daysCounter; i++){
      const tableHeadingDay = document.createElement("th");
      tableHeadingDay.classList.add(...this.tableHeadingDayIndexClasses);
      tableHeadingDay.textContent = i + 1;
      headingTableRow.append(tableHeadingDay);
    }
  
    // heading habit goal days number
    const headingHabitGoal = document.createElement("th");
    headingHabitGoal.classList.add(...this.tableHeadingTableCategoryNameClasses);
    headingHabitGoal.textContent = "Goal";
    headingTableRow.append(headingHabitGoal);
  
    // heading habit achieved days number
    const headingAchievedGoal = document.createElement("th");
    headingAchievedGoal.classList.add(...this.tableHeadingTableCategoryNameClasses);
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
      tableRow.classList.add(...this.rowCellClasses);
      tableRow.dataset.index = id;
  
      //habit heading
      const rowHeading = document.createElement("td");
      rowHeading.classList.add(...this.headingCellClasses);
      rowHeading.textContent = title;
  
      //edit Habit button
      const editButton = document.createElement("button");
      editButton.classList.add(...this.editButtonClasses);
      editButton.textContent = 'Edit title';
      rowHeading.append(editButton);
  
      //delete Habit button
      const deleteButton = document.createElement("button");
      deleteButton.classList.add(...this.deleteButtonClasses);
      deleteButton.textContent = 'Delete';
      rowHeading.append(deleteButton);
  
      tableRow.append(rowHeading);
  
      //habit days
      days.forEach((item, index) => {
        const tableCell = document.createElement("td");
        tableCell.classList.add(...this.dayCellClasses);
        tableCell.dataset.isChecked = item.checked;
        item.checked && tableCell.classList.add("day_selected");
        tableRow.append(tableCell);
        if(days.length-1 === index && index<daysCounter){
          for(let j = 0; j < daysCounter - index-1; j++){
            const tableCellDisabled = document.createElement("td");
            tableCellDisabled.classList.add(...this.dayCellDisabledClasses);
            tableRow.append(tableCellDisabled);
          }
        }
      });
  
      //habit goal
      const goalCell = document.createElement("td");
      goalCell.classList.add(...this.goalCellStyles);
      goalCell.textContent = goal;
      tableRow.append(goalCell);
  
      //habit achieved
      const achievedCell = document.createElement("td");
      achievedCell.classList.add(...this.achievedCellStyles);
      achievedCell.textContent = achieved;
      tableRow.append(achievedCell);
  
      //append habit row into habitsContainer element
      this.habitsContainer.append(tableRow);
    })
  }

}