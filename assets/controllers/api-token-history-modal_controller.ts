import { Controller } from '@hotwired/stimulus';
import { closeModal, openModal } from '../lib/modal';

/**
 * Shows the API token history dialog (a <twig:Si:Modal>) when the page was opened with a
 * `view_history` token, and drops that query parameter again when it is closed.
 */
export default class extends Controller<HTMLElement> {
    private dialog: HTMLDialogElement | null = null;

    connect(): void {
        // The dialog is only rendered when there is a token to show.
        this.dialog = this.element.querySelector('dialog');

        if (!this.dialog) {
            return;
        }

        this.element.addEventListener('si-modal:hidden', this.onHidden);
        openModal(this.dialog);
    }

    disconnect(): void {
        this.element.removeEventListener('si-modal:hidden', this.onHidden);

        if (this.dialog) {
            closeModal(this.dialog);
        }
    }

    private onHidden = (): void => {
        const url = new URL(window.location.href);
        url.searchParams.delete('view_history');
        window.location.href = url.toString();
    };
}
