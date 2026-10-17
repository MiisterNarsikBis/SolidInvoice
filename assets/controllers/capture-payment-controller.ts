import { Controller } from '@hotwired/stimulus';
import { setVisible } from '../lib/visibility';

/* stimulusFetch: 'lazy' */
export default class CapturePaymentController extends Controller<HTMLDivElement> {

    static targets: string[] = ['captureOnline', 'paymentMethod'];

    declare captureOnlineTarget: HTMLSelectElement;
    declare paymentMethodTarget: HTMLSelectElement;
    declare hasCaptureOnlineTarget: boolean;

    connect (): void {
        if (!this.hasCaptureOnlineTarget) {
            return;
        }

        setVisible(this.captureOnlineTarget, false);

        this.paymentMethodTarget.addEventListener('change', (e: Event): void => {

            const selectedOption: HTMLOptionElement|null = (e.target as HTMLSelectElement).querySelector('option:checked');

            if (selectedOption?.dataset.offline === undefined) {
                setVisible(this.captureOnlineTarget, true);
            } else {
                setVisible(this.captureOnlineTarget, false);
            }
        });
    }
}
