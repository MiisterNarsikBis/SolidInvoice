/**
 * Show or hide an element on either stack.
 *
 * Tailwind templates start an element hidden with the `hidden` attribute; Tabler templates with
 * the `d-none` class. A controller that only toggled one of them would break on the other, so it
 * sets both. `[hidden]` is honoured by Bootstrap's reboot and by Tailwind's preflight alike.
 * When the last Tabler page is gone the `d-none` half can go.
 */
export function setVisible (element: Element | null | undefined, visible: boolean): void {
    if (!element) {
        return;
    }

    (element as HTMLElement).hidden = !visible;
    element.classList.toggle('d-none', !visible);
}
