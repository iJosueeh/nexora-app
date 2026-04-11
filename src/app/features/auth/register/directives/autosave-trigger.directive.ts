import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appAutosavetrigger]',
  host: {
    '(input)': 'emitAutosave()',
    '(change)': 'emitAutosave()',
  },
})
export class AutosaveTriggerDirective {
  @Input({ required: true }) appAutosavetrigger!: () => void;

  emitAutosave(): void {
    this.appAutosavetrigger();
  }
}
