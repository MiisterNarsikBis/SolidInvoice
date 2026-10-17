import { Controller } from '@hotwired/stimulus';
import { closeModal, openModal } from '../lib/modal';

/**
 * Behaviour of <twig:Si:Modal> (a native <dialog>):
 *
 *  - opens on connect when `show` is true (a Live Component renders it open after a server action)
 *  - closes on a document-level `modal:close` event (what Live actions dispatch after a save)
 *  - closes on a backdrop click unless `static` is true
 *  - re-dispatches the native `close` event as a bubbling `si-modal:hidden`
 *
 * Opening and dismissing from buttons is handled by the delegated listeners in lib/modal.ts.
 *
 * Live Components keep attributes that JavaScript changed (here `open`) across a re-render, so a
 * modal that is open stays open while its form re-renders with validation errors.
 */
/* stimulusFetch: 'lazy' */
export default class SiModalController extends Controller<HTMLDialogElement> {

    static values = {
        show: Boolean,
        static: Boolean,
    };

    declare showValue: boolean;
    declare staticValue: boolean;

    // Set while the controller is being torn down, so closing the dialog there does not announce a
    // user-initiated close to listeners (which could, for example, trigger a navigation).
    private disposing = false;

    connect (): void {
        this.disposing = false;
        this.element.addEventListener('close', this.onClose);
        this.element.addEventListener('click', this.onBackdropClick);
        document.addEventListener('modal:close', this.onModalClose);

        if (this.showValue) {
            openModal(this.element);
        }
    }

    // A Live Component re-renders with `show` flipped (a failed code check reopens the setup dialog,
    // regenerating backup codes reopens that one). Only a CHANGE acts: a modal the user opened by hand
    // while `show` stayed false must not be closed by an unrelated re-render.
    showValueChanged (show: boolean, previous: boolean | undefined): void {
        if (previous === undefined || show === previous) {
            return;
        }

        if (show) {
            openModal(this.element);
        } else {
            closeModal(this.element);
        }
    }

    disconnect (): void {
        this.element.removeEventListener('close', this.onClose);
        this.element.removeEventListener('click', this.onBackdropClick);
        document.removeEventListener('modal:close', this.onModalClose);

        // A modal torn down while open (a page change, a Live re-render that removes it) must not
        // leave the page inert behind a backdrop.
        this.disposing = true;
        closeModal(this.element);
    }

    private onClose = (): void => {
        if (this.disposing) {
            return;
        }

        this.element.dispatchEvent(new CustomEvent('si-modal:hidden', { bubbles: true }));
    };

    private onModalClose = (): void => {
        closeModal(this.element);
    };

    // A click whose target is the <dialog> itself, not its content, is a click on the backdrop.
    private onBackdropClick = (event: MouseEvent): void => {
        if (event.target === this.element && !this.staticValue) {
            closeModal(this.element);
        }
    };
}
