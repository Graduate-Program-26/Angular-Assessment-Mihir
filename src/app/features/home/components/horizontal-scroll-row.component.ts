import { Component, input } from '@angular/core';

@Component({
    selector: 'app-horizontal-scroll-row',
    standalone: true,
    template: `
    <section [attr.aria-label]="title()">
      <div class="mb-3 flex items-center justify-between px-4 md:px-8">
        <h2 class="text-lg font-semibold">{{ title() }}</h2>
      </div>
      <div
        class="flex gap-4 overflow-x-auto px-4 pb-3 md:px-8"
        style="scrollbar-width: none; -ms-overflow-style: none;"
      >
        <ng-content />
      </div>
    </section>
  `,
    styles: [`
    :host {
      display: block;
    }
    div::-webkit-scrollbar {
      display: none;
    }
  `],
})
export class HorizontalScrollRowComponent {
    readonly title = input.required<string>();
}