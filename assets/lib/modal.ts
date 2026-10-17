/**
 * Modal helpers for the Tailwind shell, built on the native <dialog> element.
 *
 * They replace Bootstrap's `data-bs-toggle="modal"` / `data-bs-dismiss="modal"` and the
 * `Modal` class from `@tabler/core`:
 *
 *   <button type="button" data-si-modal-open="#add-address">Add</button>   opens #add-address
 *   <button type="button" data-si-modal-close>Cancel</button>              closes the enclosing modal
 *
 * One delegated listener on `document` handles every trigger, so triggers keep working after
 * a Live Component re-render replaces them. The modal itself is <twig:Si:Modal>.
 *
 * Events, both dispatched on the <dialog> and bubbling:
 *   `si-modal:open`    before showing; `detail.trigger` is the element that opened it (or null)
 *   `si-modal:hidden`  after it closed
 */

export function openModal (dialog: HTMLDialogElement, trigger: Element | null = null): void {
    if (dialog.open) {
        return;
    }

    dialog.dispatchEvent(new CustomEvent('si-modal:open', { bubbles: true, detail: { trigger } }));
    dialog.showModal();
}

export function closeModal (dialog: HTMLDialogElement): void {
    if (dialog.open) {
        dialog.close();
    }
}

let registered = false;

export function registerModalTriggers (): void {
    if (registered) {
        return;
    }

    registered = true;

    document.addEventListener('click', (event: MouseEvent): void => {
        const target = event.target instanceof Element ? event.target : null;

        const opener = target?.closest<HTMLElement>('[data-si-modal-open]');

        if (opener) {
            const dialog = document.querySelector<HTMLDialogElement>(opener.dataset.siModalOpen ?? '');

            if (dialog) {
                event.preventDefault();
                openModal(dialog, opener);
            }

            return;
        }

        const closer = target?.closest<HTMLElement>('[data-si-modal-close]');

        if (closer) {
            const dialog = closer.closest<HTMLDialogElement>('dialog');

            if (dialog) {
                closeModal(dialog);
            }
        }
    });
}
