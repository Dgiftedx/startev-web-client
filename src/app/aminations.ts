import {
   transition,
   trigger,
   state,
   query,
   style,
   animate,
   group,
   animateChild
} from '@angular/animations';

export const slideInAnimation =
   trigger('routeAnimations', [
        transition('Industries => *', [
             query(':enter, :leave', 
                  style({ position: 'fixed', width: '100%' }), 
                  { optional: true }),
             group([
                  query(':enter',[
                      style({ transform: 'translateX(-100%)' }),
                      animate('1.5s ease-in', 
                      style({ transform: 'translateX(0%)' }))
                  ], { optional: true }),
                  query(':leave', [
                      style({ transform:   'translateX(0%)'}),
                      animate('1.5s ease-out', 
                      style({ transform: 'translateX(100%)' }))
                  ], { optional: true }),
             ])
        ]),
        transition('Feeds => *', [
             query(':enter, :leave', 
                  style({ position: 'fixed',  width: '100%' }), 
                  { optional: true }),
             group([
                  query(':enter', [
                      style({ transform: 'translateX(100%)' }), 
                      animate('1.5s ease-in-out', 
                      style({ transform: 'translateX(0%)' }))
                  ], { optional: true }),
                  query(':leave', [
                      style({ transform: 'translateX(0%)' }),
                      animate('0.5s ease-in-out', 
                      style({ transform: 'translateX(-100%)' }))
                      ], { optional: true }),
              ])
        ]),
        transition('Profile => Feeds', [
              query(':enter, :leave', 
                  style({ position: 'fixed', width: '100%' }), 
                  { optional: true }),
              group([
                  query(':enter', [
                      style({ transform: 'translateX(100%)' }),
                      animate('1.5s ease-in-out', 
                      style({ transform: 'translateX(0%)' }))
                  ], { optional: true }),
                  query(':leave', [
                      style({ transform: 'translateX(0%)' }),
                      animate('1.5s ease-in-out', 
                      style({ transform: 'translateX(-100%)' }))
                  ], { optional: true }),
              ])
        ]),
        transition('* => Feeds', [
              query(':enter, :leave', 
                  style({ position: 'fixed', width: '100%' }), 
                  { optional: true }),
              group([
                  query(':enter', [
                      style({ transform: 'translateX(-100%)' }),
                      animate('0.5s ease-in-out', 
                      style({ transform: 'translateX(0%)' }))
                  ], { optional: true }),
                  query(':leave', [
                       style({ transform: 'translateX(0%)' }),
                       animate('1.5s ease-in-out', 
                       style({ transform: 'translateX(100%)' }))
                  ], { optional: true }),
              ])
       ]),
        transition('void <=> *', [
              query(':enter, :leave', 
                  style({ position: 'fixed', width: '100%' }), 
                  { optional: true }),
              group([
                  query(':enter', [
                      style({ transform: 'translateX(-100%)' }),
                      animate('1.5s ease-in', 
                      style({ transform: 'translateX(0%)' }))
                  ], { optional: true }),
                  query(':leave', [
                       style({ transform: 'translateX(0%)' }),
                       animate('1.5s ease-out', 
                       style({ transform: 'translateX(100%)' }))
                  ], { optional: true }),
              ])
       ]),
]);