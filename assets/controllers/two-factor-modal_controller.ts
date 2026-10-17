/*
 * This file is part of SolidInvoice package.
 *
 * (c) Pierre du Plessis <open-source@solidworx.co>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

import { Controller } from '@hotwired/stimulus';
import { getComponent } from '@symfony/ux-live-component';

/**
 * Keeps the two-factor Live Component's modal flags in step with its dialogs.
 *
 * The dialogs are <twig:Si:Modal> elements (native <dialog>), which open themselves when the server
 * renders them with `show` set (see si-modal_controller.ts). The reverse direction lives here: when
 * the user closes one, it dispatches a bubbling `si-modal:hidden`, and the matching LiveProp is set
 * back to false so the next re-render does not reopen it.
 */
const FLAGS: Record<string, string> = {
    'totp-setup-modal': 'showQrModal',
    'backup-codes-modal': 'showBackupCodes',
};

export default class extends Controller<HTMLElement> {
    connect(): void {
        this.element.addEventListener('si-modal:hidden', this.onHidden);
    }

    disconnect(): void {
        this.element.removeEventListener('si-modal:hidden', this.onHidden);
    }

    private onHidden = async (event: Event): Promise<void> => {
        const dialog = event.target as HTMLElement | null;
        const flag = dialog ? FLAGS[dialog.id] : undefined;

        if (!flag || !this.element.hasAttribute('data-live-name-value')) {
            return;
        }

        try {
            const component = await getComponent(this.element);
            await component.set(flag, false);
        } catch (error) {
            console.error('Failed to update LiveComponent state:', error);
        }
    };
}
