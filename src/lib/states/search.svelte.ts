export const searchState = $state({
    isOpen: false,
    toggle() {
        this.isOpen = !this.isOpen;
    },
    open() {
        this.isOpen = true;
    },
    close() {
        this.isOpen = false;
    }
});
