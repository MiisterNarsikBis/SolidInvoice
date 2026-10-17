import { Controller } from '@hotwired/stimulus';

/**
 * A small disclosure menu for the Tailwind shell (company switcher, Create, user menu).
 * Replaces Bootstrap's `data-bs-toggle="dropdown"`, which only toggles a `.show` class that the
 * Tailwind stylesheet does not define.
 *
 *   <div data-controller="si-dropdown">
 *       <button data-si-dropdown-target="trigger" data-action="si-dropdown#toggle" aria-haspopup="menu" aria-expanded="false">
 *       <div data-si-dropdown-target="panel" hidden>...</div>
 *   </div>
 *
 * Closes on outside click and on Escape (returning focus to the trigger).
 *
 * `data-si-dropdown-fixed-value="true"` positions the panel with `position: fixed` from the
 * trigger's rectangle instead of absolutely inside its parent. Use it where an ancestor clips
 * overflow (a horizontally scrolling table): the panel then escapes the clipping. A fixed panel
 * closes on scroll and resize rather than trying to follow the trigger.
 */
/* stimulusFetch: 'lazy' */
export default class SiDropdownController extends Controller<HTMLElement> {

    static targets: string[] = ['trigger', 'panel'];

    static values = {
        fixed: Boolean,
    };

    declare fixedValue: boolean;

    declare triggerTarget: HTMLElement;
    declare panelTarget: HTMLElement;

    connect (): void {
        document.addEventListener('click', this.onDocumentClick);
        document.addEventListener('keydown', this.onKeydown);
    }

    disconnect (): void {
        document.removeEventListener('click', this.onDocumentClick);
        document.removeEventListener('keydown', this.onKeydown);
    }

    toggle (): void {
        if (this.panelTarget.hidden) {
            this.open();
        } else {
            this.close();
        }
    }

    open (): void {
        this.panelTarget.hidden = false;
        this.triggerTarget.setAttribute('aria-expanded', 'true');

        if (this.fixedValue) {
            this.placeFixed();
            window.addEventListener('scroll', this.onViewportChange, true);
            window.addEventListener('resize', this.onViewportChange);
        }
    }

    close (): void {
        this.panelTarget.hidden = true;
        this.triggerTarget.setAttribute('aria-expanded', 'false');

        window.removeEventListener('scroll', this.onViewportChange, true);
        window.removeEventListener('resize', this.onViewportChange);
    }

    // Opens below the trigger, right-aligned to it, or above it when there is no room below.
    private placeFixed (): void {
        const panel = this.panelTarget;
        const rect = this.triggerTarget.getBoundingClientRect();

        panel.style.position = 'fixed';
        panel.style.right = `${Math.max(8, window.innerWidth - rect.right)}px`;
        panel.style.left = 'auto';
        panel.style.top = `${rect.bottom + 6}px`;

        const overflow = panel.getBoundingClientRect().bottom - window.innerHeight + 8;

        if (overflow > 0) {
            panel.style.top = `${Math.max(8, rect.top - panel.offsetHeight - 6)}px`;
        }
    }

    private onViewportChange = (): void => {
        if (!this.panelTarget.hidden) {
            this.close();
        }
    };

    private onDocumentClick = (event: Event): void => {
        if (!this.panelTarget.hidden && !this.element.contains(event.target as Node)) {
            this.close();
        }
    };

    private onKeydown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape' && !this.panelTarget.hidden) {
            this.close();
            this.triggerTarget.focus();
        }
    };
}
