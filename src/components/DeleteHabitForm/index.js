import { createElement, removeHabit } from '../../helpers.js'

export class DeleteHabitForm {
    constructor(habitId) {
        if (!habitId) {
            throw new Error('Habit id required');
        }

        this.habitId = habitId;
        this.render();
        this.addEventListeners();
    }

    render = () => {
        this.elem = createElement(`<div>
            <p>Do you want to delete a habit?</p>
            <div>
                <!-- type="cancel не бывает" -->
                <button id="delete-cancel-btn" type="button">No</button>
                <button id="delete-submit-btn" type="button">Yes</button>
            </div>
        </div`);
    }

    addEventListeners = () => {
        this.elem.addEventListener('click', (event) => {
            const cancel = event.target.closest('#delete-cancel-btn');
            const submit = event.target.closest('#delete-submit-btn');

            if (submit) {
                removeHabit(this.habitId);
                this.elem.dispatchEvent(new CustomEvent('habit-deleted', {
                    bubbles: true,
                    detail: {
                        id: this.habitId
                    }
                }));
            } else if (cancel) {
                this.elem.dispatchEvent(new CustomEvent('habit-delete-cancel', {
                    bubbles: true,
                    detail: {
                        id: this.habitId
                    }
                }));
            }
        });
    }

    close = () => {
        this.destroy();
    }

    destroy = () => { // alias for this.close()
        this.elem.remove();
    }
}
