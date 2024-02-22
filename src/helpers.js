const habitsLocalStorageKey = 'habitsData';

export function getHabitsData() {
    const habitsData = localStorage.getItem(habitsLocalStorageKey);

    if (!habitsData) return [];

    return JSON.parse(habitsData);
}

export function updatedHabitsData(habitId, title) {
    const habitsList = getHabitsData();

    const habit = habitsList.find(({ id }) => `${id}` === `${habitId}`);

    if (!habit) {
        throw new Error(`Habit with id "${habitId}" not found`);
    }

    habit.title = title;

    localStorage.setItem(habitsLocalStorageKey, JSON.stringify(habitsList));
}

export function removeHabit(habitId) {
    const habitsList = getHabitsData();
    localStorage.setItem(
        habitsLocalStorageKey,
        JSON.stringify(habitsList.filter(({ id }) => `${id}` !== `${habitId}`)),
    );
}

export function createElement(html) {
    // doesn't work for td and some other elements that may not be placed into <div>
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild;
}

export const getDaysAmount = (habitsData) =>{
    let daysCounter = 0;
  
    //the biggest habit goal in days
    habitsData.forEach(({ days }) => {
      if(days.length>daysCounter){
          daysCounter = days.length;
      }
    })
  
    return daysCounter;
  }