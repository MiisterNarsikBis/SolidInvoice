import { Controller } from '@hotwired/stimulus';

/**
 * The mobile navigation drawer of the Tailwind shell. It only flips `data-open` on its own
 * element; the sidebar and the backdrop react to it through Tailwind's
 * `group-data-[open]/shell:` variants, so no class names live in this file.
 *
 * Closes on Escape and when the viewport grows past the desktop breakpoint.
 */
/* stimulusFetch: 'lazy' */
export default class SiDrawerController extends Controller<HTMLElement> {

    connect (): void {
        document.addEventListener('keydown', this.onKeydown);
        window.addEventListener('resize', this.onResize);
    }

    disconnect (): void {
        document.removeEventListener('keydown', this.onKeydown);
        window.removeEventListener('resize', this.onResize);
    }

    toggle (): void {
        if (this.element.hasAttribute('data-open')) {
            this.close();
        } else {
            this.open();
        }
    }

    open (): void {
        this.element.setAttribute('data-open', '');
        this.element.querySelector<HTMLElement>('[data-si-drawer-toggle]')?.setAttribute('aria-expanded', 'true');
    }

    close (): void {
        this.element.removeAttribute('data-open');
        this.element.querySelector<HTMLElement>('[data-si-drawer-toggle]')?.setAttribute('aria-expanded', 'false');
    }

    private onKeydown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            this.close();
        }
    };

    private onResize = (): void => {
        if (window.innerWidth >= 1024) {
            this.close();
        }
    };
}
