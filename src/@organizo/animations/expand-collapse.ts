import {animate, state, style, transition, trigger} from '@angular/animations';
import {OrganizoAnimationCurves, OrganizoAnimationDurations} from '@organizo/animations/defaults';

// -----------------------------------------------------------------------------------------------------
// @ Expand / collapse
// -----------------------------------------------------------------------------------------------------
const expandCollapse = trigger('expandCollapse',
  [
    state('void, collapsed',
      style({
        height: '0',
      }),
    ),

    state('*, expanded',
      style('*'),
    ),

    // Prevent the transition if the store is false
    transition('void <=> false, collapsed <=> false, expanded <=> false', []),

    // Transition
    transition('void <=> *, collapsed <=> expanded',
      animate('{{timings}}'),
      {
        params: {
          timings: `${OrganizoAnimationDurations.entering} ${OrganizoAnimationCurves.deceleration}`,
        },
      },
    ),
  ],
);

export {expandCollapse};
