import { Controller } from '@hotwired/stimulus';
import { setVisible } from '../lib/visibility';

/* stimulusFetch: 'lazy' */
export default class BillingIdController extends Controller<HTMLDivElement> {

    static targets: string[] = ['value', 'form', 'info'];

    declare valueTarget: HTMLSpanElement;
    declare formTarget: HTMLDivElement;
    declare infoTarget: HTMLSpanElement;

    private originalValue: string = '';

    connect() {
        this.originalValue = this.valueTarget.innerText;
    }

    edit(e: Event) {
        e.preventDefault();
        setVisible(this.infoTarget, false);
        setVisible(this.formTarget, true);
    }

    save(e: Event) {
        e.preventDefault();

        const value: string = this.formTarget.querySelector('input')?.value ?? '';

        if (value.length === 0) {

            if (this.formTarget.querySelector('[data-billing-id-error]')) {
                return;
            }

            const message = this.formTarget.dataset.errorBlank ?? '';
            const errorHtml = `<p class="si-error" data-billing-id-error>${message}</p>`;

            this.formTarget.querySelector('.si-group')?.insertAdjacentHTML('afterend', errorHtml);
        } else {
            this.formTarget.querySelector('[data-billing-id-error]')?.remove();

            this.valueTarget.innerText = value;

            setVisible(this.infoTarget, true);
            setVisible(this.formTarget, false);
        }
    }

    cancel(e: Event) {
        e.preventDefault();
        setVisible(this.infoTarget, true);
        setVisible(this.formTarget, false);

        this.formTarget.querySelector('[data-billing-id-error]')?.remove();
        const input = this.formTarget.querySelector('input');

        if (input) {
            input.value = this.originalValue;
        }
    }
}
