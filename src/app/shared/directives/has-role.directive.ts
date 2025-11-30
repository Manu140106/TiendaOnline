import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: false
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string | string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser) {
      this.viewContainer.clear();
      return;
    }

    const allowedRoles = Array.isArray(this.appHasRole) 
      ? this.appHasRole 
      : [this.appHasRole];

    const hasRole = allowedRoles.includes(currentUser.role);

    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}