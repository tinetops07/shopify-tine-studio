class SearchImagePopover extends HTMLElement {
  connectedCallback() {
    this.details = this.querySelector('details');
    this.summary = this.querySelector('summary');
    this.toggleButton = this.querySelector('[data-image-search-toggle]');

    if (!this.details || !this.summary || !this.toggleButton) return;

    this.onDocumentClick = (event) => {
      if (!this.details?.open || this.contains(event.target)) return;
      this.details.open = false;
    };

    this.onToggleClick = (event) => {
      event.preventDefault();
      this.details.open = !this.details.open;
    };

    this.onKeyDown = (event) => {
      if (event.key === 'Escape') this.details.open = false;
    };

    this.toggleButton.addEventListener('click', this.onToggleClick);
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('keydown', this.onKeyDown);
  }

  disconnectedCallback() {
    this.toggleButton?.removeEventListener('click', this.onToggleClick);
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('keydown', this.onKeyDown);
  }
}

if (!customElements.get('search-image-popover')) {
  customElements.define('search-image-popover', SearchImagePopover);
}