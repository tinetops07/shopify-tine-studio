class SearchImagePopover extends HTMLElement {
  connectedCallback() {
    this.details = /** @type {HTMLDetailsElement | null} */ (this.querySelector('details'));
    this.summary = /** @type {HTMLElement | null} */ (this.querySelector('summary'));
    this.toggleButton = /** @type {HTMLElement | null} */ (this.querySelector('[data-image-search-toggle]'));
    this.dropzone = /** @type {HTMLElement | null} */ (this.querySelector('[data-image-dropzone]'));
    this.fileInput = /** @type {HTMLInputElement | null} */ (this.querySelector('[data-image-file-input]'));
    this.uploadEmpty = /** @type {HTMLElement | null} */ (this.querySelector('[data-image-upload-empty]'));
    this.uploading = /** @type {HTMLElement | null} */ (this.querySelector('[data-image-uploading]'));
    this.preview = /** @type {HTMLElement | null} */ (this.querySelector('[data-image-preview]'));
    this.previewImage = /** @type {HTMLImageElement | null} */ (this.querySelector('[data-image-preview-image]'));
    this.previewClose = /** @type {HTMLElement | null} */ (this.querySelector('[data-image-preview-close]'));
    this.uploadNew = /** @type {HTMLElement | null} */ (this.querySelector('[data-image-upload-new]'));
    this.examplesHeading = /** @type {HTMLElement | null} */ (this.querySelector('[data-image-examples-heading]'));
    this.examples = /** @type {HTMLElement | null} */ (this.querySelector('[data-image-examples]'));
    this.resultsHeading = /** @type {HTMLElement | null} */ (this.querySelector('[data-image-results-heading]'));
    this.results = /** @type {HTMLElement | null} */ (this.querySelector('[data-image-results]'));

    if (!this.details || !this.summary || !this.toggleButton || !this.dropzone || !this.fileInput) return;

    /** @param {Event} event */
    this.onDocumentClick = (event) => {
      if (!this.details?.open || !(event.target instanceof Node) || this.contains(event.target)) return;
      this.details.open = false;
    };

    /** @param {Event} event */
    this.onToggleClick = (event) => {
      event.preventDefault();
      if (this.details) this.details.open = !this.details.open;
    };

    /** @param {KeyboardEvent} event */
    this.onKeyDown = (event) => {
      if (event.key === 'Escape' && this.details) this.details.open = false;
    };

    /** @param {Event} event */
    this.onFileChange = (event) => {
      const input = /** @type {HTMLInputElement} */ (event.currentTarget);
      const file = input.files?.[0];
      if (file) this.showImage(file);
    };

    /** @param {Event} event */
    this.onDragOver = (event) => {
      const dragEvent = /** @type {DragEvent} */ (event);
      dragEvent.preventDefault();
      this.dropzone?.classList.add('search-action__dropzone--dragging');
    };

    /** @param {Event} event */
    this.onDrop = (event) => {
      const dragEvent = /** @type {DragEvent} */ (event);
      dragEvent.preventDefault();
      this.dropzone?.classList.remove('search-action__dropzone--dragging');
      const file = dragEvent.dataTransfer?.files[0];
      if (file?.type.startsWith('image/')) this.showImage(file);
    };

    this.onDragLeave = () => this.dropzone?.classList.remove('search-action__dropzone--dragging');

    this.onPreviewClose = () => this.resetImage();
    this.onUploadNew = () => this.fileInput?.click();

    this.toggleButton.addEventListener('click', this.onToggleClick);
    this.fileInput.addEventListener('change', this.onFileChange);
    this.dropzone.addEventListener('dragover', this.onDragOver);
    this.dropzone.addEventListener('drop', this.onDrop);
    this.dropzone.addEventListener('dragleave', this.onDragLeave);
    this.previewClose?.addEventListener('click', this.onPreviewClose);
    this.uploadNew?.addEventListener('click', this.onUploadNew);
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('keydown', this.onKeyDown);
  }

  /** @param {File} file */
  showImage(file) {
    if (!file.type.startsWith('image/') || !this.previewImage) return;
    this.uploadEmpty?.setAttribute('hidden', '');
    this.uploading?.removeAttribute('hidden');
    this.preview?.setAttribute('hidden', '');
    this.uploadNew?.setAttribute('hidden', '');
    this.dropzone?.classList.add('search-action__dropzone--preview');

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string' || !this.previewImage) return;
      this.previewImage.src = reader.result;
      this.uploading?.setAttribute('hidden', '');
      this.preview?.removeAttribute('hidden');
      this.uploadNew?.removeAttribute('hidden');
      this.examplesHeading?.setAttribute('hidden', '');
      this.examples?.setAttribute('hidden', '');
      this.resultsHeading?.removeAttribute('hidden');
      this.results?.removeAttribute('hidden');
    });
    reader.readAsDataURL(file);
  }

  resetImage() {
    if (this.fileInput) this.fileInput.value = '';
    if (this.previewImage) this.previewImage.removeAttribute('src');
    this.preview?.setAttribute('hidden', '');
    this.uploadNew?.setAttribute('hidden', '');
    this.uploadEmpty?.removeAttribute('hidden');
    this.uploading?.setAttribute('hidden', '');
    this.dropzone?.classList.remove('search-action__dropzone--preview');
    this.examplesHeading?.removeAttribute('hidden');
    this.examples?.removeAttribute('hidden');
    this.resultsHeading?.setAttribute('hidden', '');
    this.results?.setAttribute('hidden', '');
  }

  disconnectedCallback() {
    if (this.toggleButton && this.onToggleClick) {
      this.toggleButton.removeEventListener('click', /** @type {EventListener} */ (this.onToggleClick));
    }
    if (this.fileInput && this.onFileChange) {
      this.fileInput.removeEventListener('change', /** @type {EventListener} */ (this.onFileChange));
    }
    if (this.dropzone && this.onDragOver) {
      this.dropzone.removeEventListener('dragover', /** @type {EventListener} */ (this.onDragOver));
    }
    if (this.dropzone && this.onDrop) {
      this.dropzone.removeEventListener('drop', /** @type {EventListener} */ (this.onDrop));
    }
    if (this.dropzone && this.onDragLeave) {
      this.dropzone.removeEventListener('dragleave', /** @type {EventListener} */ (this.onDragLeave));
    }
    if (this.previewClose && this.onPreviewClose) {
      this.previewClose.removeEventListener('click', /** @type {EventListener} */ (this.onPreviewClose));
    }
    if (this.uploadNew && this.onUploadNew) {
      this.uploadNew.removeEventListener('click', /** @type {EventListener} */ (this.onUploadNew));
    }
    if (this.onDocumentClick) document.removeEventListener('click', this.onDocumentClick);
    if (this.onKeyDown) document.removeEventListener('keydown', this.onKeyDown);
  }
}

if (!customElements.get('search-image-popover')) {
  customElements.define('search-image-popover', SearchImagePopover);
}