import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent, Subscription } from 'rxjs';
import { trackClick } from '../state/click-tracker.actions';

@Directive({
  selector: '[appClickTracker]',
  standalone: true,
})
export class ClickTrackerDirective implements OnInit, OnDestroy {
  @Input('appClickTracker') inlineTag?: string;

  private clickSubscription?: Subscription;

  constructor(
    private el: ElementRef,
    private store: Store
  ) {}

  ngOnInit(): void {
    // Manually subscribe to click events on the native element
    this.clickSubscription = fromEvent(this.el.nativeElement, 'click').subscribe(() => {
      // Determine the tracking tag from the input binding or DOM attributes
      const tag =
        this.inlineTag ||
        this.el.nativeElement.getAttribute('data-tracking-tag') ||
        this.el.nativeElement.getAttribute('trackingTag') ||
        this.el.nativeElement.id ||
        'generic-click';

      this.store.dispatch(trackClick({ tag }));
    });
  }

  ngOnDestroy(): void {
    if (this.clickSubscription) {
      this.clickSubscription.unsubscribe();
    }
  }
}
