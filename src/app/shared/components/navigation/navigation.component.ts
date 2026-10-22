import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'adl-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NavigationComponent {

  links: Array<{ name: string, href: string }> = [
    { name: 'about', href: '#about' },
    { name: 'experience', href: '#experience' },
    // { name: 'projects', href: '#projects' },
  ];

}
