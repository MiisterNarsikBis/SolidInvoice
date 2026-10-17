import { Controller } from '@hotwired/stimulus';

/**
 * Opens and closes a native <dialog> in the Tailwind shell. Replaces Bootstrap's modal and
 * offcanvas (`data-bs-toggle`), which depend on CSS the Tailwind stylesheet does not define.
 * `showModal()` gives the focus trap, Escape handling and the `::backdrop` for free.
 *
 *   <div data-controller="si-dialog">
 *       <button type="button" data-action="si-dialog#open">Open</button>
 *       <dialog data-si-dialog-target="dialog" data-action="click->si-dialog#closeOnBackdrop">
 *           <button type="button" data-action="si-dialog#close">Close</button>
 *       </dialog>
 *   </div>
 */
/* stimulusFetch: 'lazy' */
export default class SiDialogController extends Controller<HTMLElement> {

    static targets: string[] = ['dialog'];

    declare dialogTarget: HTMLDialogElement;

    open (): void {
        if (!this.dialogTarget.open) {
            this.dialogTarget.showModal();
        }
    }

    close (): void {
        this.dialogTarget.close();
    }

    // A click on the dialog element itself (not on its content) is a click on the backdrop.
    closeOnBackdrop (event: MouseEvent): void {
        if (event.target === this.dialogTarget) {
            this.close();
        }
    }
}
