import { Controller } from '@hotwired/stimulus';
import { setVisible } from '../lib/visibility';

/**
 * Controller for payment method card selection
 * Handles visual selection and shows/hides capture online toggle based on payment method type
 *
 * @stimulusFetch lazy
 */
export default class PaymentMethodSelectController extends Controller<HTMLDivElement> {
    static targets: string[] = ['card', 'captureOnline'];

    declare cardTargets: HTMLLabelElement[];
    declare captureOnlineTarget: HTMLElement;
    declare hasCaptureOnlineTarget: boolean;

    connect(): void {
        // Initialize: check if any payment method is pre-selected
        this.updateCaptureOnlineVisibility();
    }

    /**
     * Called when a payment method card is selected
     */
    select(): void {
        this.updateCaptureOnlineVisibility();
    }

    /**
     * Shows or hides the capture online toggle based on the selected payment method
     */
    private updateCaptureOnlineVisibility(): void {
        if (!this.hasCaptureOnlineTarget) {
            return;
        }

        // Find the selected card
        const selectedCard = this.cardTargets.find(card => {
            const input = card.querySelector('input[type="radio"]') as HTMLInputElement;
            return input?.checked;
        });

        if (!selectedCard) {
            // No selection, hide capture online
            setVisible(this.captureOnlineTarget, false);
            return;
        }

        const isOffline = selectedCard.dataset.offline === 'true';

        if (isOffline) {
            // Offline payment method - hide capture online toggle
            setVisible(this.captureOnlineTarget, false);
        } else {
            // Online payment method - show capture online toggle
            setVisible(this.captureOnlineTarget, true);
        }
    }
}
