import { Context, Controller } from '@hotwired/stimulus';
import { getComponent } from '@symfony/ux-live-component';
import { closeModal } from '../lib/modal';

/**
 * Coordinates closing the API-token creation dialog (a <twig:Si:Modal>, a native <dialog>) with the
 * Live Component state: after the user confirms they have copied the token, the dialog closes and
 * only then is the `clearToken` action sent, so the token is not wiped from the screen while it is
 * still being read.
 */
export default class extends Controller<HTMLElement> {
    private shouldClearOnHide: boolean = false;
    private dialog: HTMLDialogElement | null = null;
    private boundHandleHidden: () => Promise<void>;

    constructor(context: Context) {
        super(context);
        this.boundHandleHidden = this.handleHidden.bind(this);
    }

    connect(): void {
        this.dialog = this.element.querySelector('dialog');

        // <twig:Si:Modal> re-dispatches the dialog's native `close` as a bubbling `si-modal:hidden`.
        this.element.addEventListener('si-modal:hidden', this.boundHandleHidden);
    }

    disconnect(): void {
        this.element.removeEventListener('si-modal:hidden', this.boundHandleHidden);
    }

    confirmAndClose(event: Event): void {
        event.preventDefault();

        if (!this.dialog) {
            return;
        }

        // Only clear the state when the close was started by the confirm button.
        this.shouldClearOnHide = true;
        closeModal(this.dialog);
    }

    private async handleHidden(): Promise<void> {
        if (!this.shouldClearOnHide) {
            return;
        }

        this.shouldClearOnHide = false;

        const liveComponent = this.element.closest('[data-controller*="live"]');

        if (liveComponent instanceof HTMLElement) {
            const component = await getComponent(liveComponent);
            await component.action('clearToken');
        }
    }
}
