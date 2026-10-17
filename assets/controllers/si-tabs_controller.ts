import { Controller } from '@hotwired/stimulus';

/**
 * In-page tabs for the Tailwind shell, replacing Bootstrap's `data-bs-toggle="tab"`.
 *
 *   <div data-controller="si-tabs">
 *       <button role="tab" aria-selected="true" data-si-tabs-target="tab" data-action="si-tabs#select" aria-controls="a">A</button>
 *       <button role="tab" aria-selected="false" data-si-tabs-target="tab" data-action="si-tabs#select" aria-controls="b">B</button>
 *       <div role="tabpanel" id="a" data-si-tabs-target="panel">...</div>
 *       <div role="tabpanel" id="b" data-si-tabs-target="panel" hidden>...</div>
 *   </div>
 *
 * The selected tab carries `aria-selected="true"`, which the Tailwind classes on <twig:Si:Tab> style
 * through the `aria-selected:` variant, so this controller holds no class names. Arrow keys move
 * between tabs. Use <twig:Si:Tabs>, <twig:Si:Tab> and <twig:Si:TabPanel> rather than writing this
 * markup by hand.
 */
/* stimulusFetch: 'lazy' */
export default class SiTabsController extends Controller<HTMLElement> {

    static targets: string[] = ['tab', 'panel'];

    declare tabTargets: HTMLElement[];
    declare panelTargets: HTMLElement[];

    select (event: Event): void {
        const tab = (event.currentTarget as HTMLElement | null);

        if (tab) {
            this.activate(tab);
        }
    }

    // Left / right (and Home / End) move between tabs, as the ARIA tabs pattern asks.
    keydown (event: KeyboardEvent): void {
        const tabs = this.tabTargets;
        const current = tabs.indexOf(document.activeElement as HTMLElement);

        if (current === -1) {
            return;
        }

        let next: number;

        switch (event.key) {
            case 'ArrowRight': next = (current + 1) % tabs.length; break;
            case 'ArrowLeft': next = (current - 1 + tabs.length) % tabs.length; break;
            case 'Home': next = 0; break;
            case 'End': next = tabs.length - 1; break;
            default: return;
        }

        event.preventDefault();
        tabs[next].focus();
        this.activate(tabs[next]);
    }

    private activate (selected: HTMLElement): void {
        const panelId = selected.getAttribute('aria-controls');

        this.tabTargets.forEach((tab: HTMLElement): void => {
            const isSelected = tab === selected;

            tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
            tab.tabIndex = isSelected ? 0 : -1;
        });

        this.panelTargets.forEach((panel: HTMLElement): void => {
            panel.hidden = panel.id !== panelId;
        });

        selected.dispatchEvent(new CustomEvent('si-tabs:change', { bubbles: true, detail: { panel: panelId } }));
    }
}
