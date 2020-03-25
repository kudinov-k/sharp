import { animate, group, query, style, transition, trigger } from '@angular/animations'

export const RouteAnimationsAuth =
  trigger('routeAnimationsAuth', [
    transition('* => *', [
      query(
        ':enter',
        [style({opacity: 0, position: 'absolute', top: 0, width: '100%'})],
        {optional: true}
      ),
      group([
        query(
          ':leave',
          [style({opacity: 1}), animate('.1s', style({opacity: 0}))],
          {optional: true}
        ),
        query(
          ':enter',
          [style({opacity: 0}), animate('.1s', style({opacity: 1}))],
          {optional: true}
        )
      ])
    ])
  ])

export const RouterAnimations =
  trigger('routeAnimations', [
    transition('* => *', [
      query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 20,
            left: 20,
            width: '96%',
            height: '100%',
          })
        ],
        {optional: true}
      ),
      group([
        query(
          ':leave',
          [style({opacity: 1}), animate('.1s', style({opacity: 0}))],
          {optional: true}
        ),
        query(
          ':enter',
          [style({opacity: 0}), animate('.1s', style({opacity: 1}))],
          {optional: true}
        )
      ])
    ])
  ])

export const TableRowAnimations =
  trigger('tableRowAnimation', [
    transition(':enter', [
      style({opacity: 0.2, height: '{{rowHeight}}' + 'px'}),
      animate('0.2s ease-in', style({opacity: 1, height: '*'}))
    ])
  ])
