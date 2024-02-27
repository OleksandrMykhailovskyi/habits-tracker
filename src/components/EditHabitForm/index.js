import { getHabitsData, updatedHabitsData, createElement } from '../../helpers.js'

export class EditHabitForm {
    constructor(habitId) {
        if (!habitId) {
            throw new Error('Habit id required');
        }

        this.habitId = habitId;
        this.render();
        this.addEventListeners();
    }

    render = () => {
        const habitsData = getHabitsData();
        const habitTitle = habitsData.find((habit) => habit.id === this.habitId)?.title;

        if (typeof habitTitle === 'undefined') {
            throw new Error('Habit not found');
        }

        this.elem = createElement(`<form id="edit-habit-form">
            <input class="text-black border" type="text" placeholder="Please fill in a new title" name="title" value="${habitTitle}">
            <button id="edit-title-btn" type="submit">Submit</button>
        </form>`);
    }

    addEventListeners = () => {
        this.elem.addEventListener('submit', (event) => {
            event.preventDefault();

            const newTitle = this.elem.elements['title'].value;

            updatedHabitsData(this.habitId, newTitle);

            this.elem.dispatchEvent(new CustomEvent('habit-updated', {
                bubbles: true,
                detail: {
                    id: this.habitId,
                    title: newTitle,
                }
            }));
        });
    }

    close = () => {
        this.destroy();
    }

    destroy = () => { // alias for this.close()
        this.elem.remove();
    }
}