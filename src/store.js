import { defineStore } from 'pinia';

export const useCardStore = defineStore('card', {
  state: () => ({
    isCardActive: JSON.parse(localStorage.getItem('isCardActive')) || false, // Load the state from localStorage or set to false by default
  }),
  actions: {
    activateCard() {
      this.isCardActive = true;
      localStorage.setItem('isCardActive', JSON.stringify(this.isCardActive)); // Save the state to localStorage
    },
    deactivateCard() {
      this.isCardActive = false;
      localStorage.setItem('isCardActive', JSON.stringify(this.isCardActive)); // Save the state to localStorage
    },
  },
});
