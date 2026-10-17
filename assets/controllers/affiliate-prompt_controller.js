/* global document, fetch, URLSearchParams */
import { Controller } from '@hotwired/stimulus';

/*
 * The one-off affiliate prompt in the corner of the dashboard.
 *
 * It is rendered hidden and shown on connect, so there is no flash of an unstyled panel and
 * no dependency on Bootstrap's Toast. However it closes — the close button, "Not now", Escape
 * or the join button — the dismissal is saved in the background, so it never comes back and
 * the page never reloads.
 */
/* stimulusFetch: 'lazy' */
export default class extends Controller {
    static values = {
        dismissUrl: String,
        token: String,
    };

    #dismissed = false;

    connect() {
        // Never compete with a dialog that is already open; the prompt waits for the next visit.
        if (document.querySelector('dialog[open]')) {
            return;
        }

        this.element.hidden = false;
        document.addEventListener('keydown', this.#closeOnEscape);
    }

    disconnect() {
        document.removeEventListener('keydown', this.#closeOnEscape);
    }

    close() {
        this.element.hidden = true;
        this.#dismiss();
    }

    #closeOnEscape = (event) => {
        // An Escape meant for a dialog opened on top must not dismiss the prompt for good.
        if (event.key === 'Escape' && !this.element.hidden && !document.querySelector('dialog[open]')) {
            this.close();
        }
    };

    #dismiss = () => {
        if (this.#dismissed) {
            return;
        }

        this.#dismissed = true;

        // keepalive, because the join button can take the user away from the page mid-request.
        fetch(this.dismissUrlValue, {
            method: 'POST',
            body: new URLSearchParams({ _token: this.tokenValue }),
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            keepalive: true,
        });
    };
}
