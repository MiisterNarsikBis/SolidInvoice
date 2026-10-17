import { Controller } from '@hotwired/stimulus';
import { setVisible } from '../lib/visibility';

/* stimulusFetch: 'lazy' */
export default class MailsettingsController extends Controller<HTMLDivElement> {

    static targets: string[] = ['provider'];

    declare providerTarget: HTMLSelectElement;

    connect (): void {
        this.providerTarget.addEventListener('change', (e: Event): void => {
            this.element.querySelectorAll('[data-provider]').forEach((el: Element): void => {
                setVisible(el, false);
            });

            const target: string = (e.target as HTMLInputElement).value.replace(' ', '-');

            setVisible(this.element.querySelector(`[data-provider="${target}"]`), true)
        });
    }
}
