import { Controller } from '@hotwired/stimulus';
import { closeModal, openModal } from '../lib/modal';

/**
 * The "delete company" confirmation: the user has to type the company's name before the delete
 * button is enabled. The dialog is a <twig:Si:Modal> (a native <dialog>), the `modal` target.
 */
/* stimulusFetch: 'lazy' */
export default class extends Controller<HTMLElement> {
    static targets = ['modal', 'companyNameInput', 'confirmButton'];
    static values = { companyName: String };

    declare readonly modalTarget: HTMLDialogElement;
    declare readonly companyNameInputTarget: HTMLInputElement;
    declare readonly confirmButtonTarget: HTMLButtonElement;
    declare readonly companyNameValue: string;

    showModal() {
        this.companyNameInputTarget.value = '';
        this.updateConfirmButton();
        openModal(this.modalTarget);
        this.companyNameInputTarget.focus();
    }

    hideModal() {
        closeModal(this.modalTarget);
    }

    validateInput() {
        this.updateConfirmButton();
    }

    private updateConfirmButton() {
        const isValid = this.companyNameInputTarget.value.trim() === this.companyNameValue.trim();
        this.confirmButtonTarget.disabled = !isValid;
    }
}
