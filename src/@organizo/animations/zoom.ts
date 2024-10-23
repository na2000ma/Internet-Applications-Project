import {animate, state, style, transition, trigger} from '@angular/animations';
import {OrganizoAnimationCurves, OrganizoAnimationDurations} from '@organizo/animations/defaults';

// -----------------------------------------------------------------------------------------------------
// @ Zoom in
// -----------------------------------------------------------------------------------------------------
const zoomIn = trigger('zoomIn',
  [

    state('void',
      style({
        opacity: 0,
        transform: 'scale(0)',
      }),
    ),

    state('*',
      style({
        opacity: 1,
        transform: 'scale(1)',
      }),
    ),

    // Prevent the transition if the store is false
    transition('void => false', []),

    // Transition
    transition('void => *', animate('{{timings}}'),
      {
        params: {
          timings: `${OrganizoAnimationDurations.entering} ${OrganizoAnimationCurves.deceleration}`,
        },
      },
    ),
  ],
);

// -----------------------------------------------------------------------------------------------------
// @ Zoom out
// -----------------------------------------------------------------------------------------------------
const zoomOut = trigger('zoomOut',
  [

    state('*',
      style({
        opacity: 1,
        transform: 'scale(1)',
      }),
    ),

    state('void',
      style({
        opacity: 0,
        transform: 'scale(0)',
      }),
    ),

    // Prevent the transition if the store is false
    transition('false => void', []),

    // Transition
    transition('* => void', animate('{{timings}}'),
      {
        params: {
          timings: `${OrganizoAnimationDurations.exiting} ${OrganizoAnimationCurves.acceleration}`,
        },
      },
    ),
  ],
);

export {zoomIn, zoomOut};

