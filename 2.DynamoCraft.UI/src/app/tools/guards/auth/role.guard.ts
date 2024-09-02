import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/api/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    console.log("Guard triggered");

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
        return router.parseUrl('/acces-non-autoriser');
    }

    const requiredRole = Number(route.data['role']);
    console.log('Current User Role ID:', currentUser.roleId);
    console.log('Required Role:', requiredRole);

    if (currentUser.roleId !== undefined && currentUser.roleId >= requiredRole) {
        return true;
    }

    return router.parseUrl('/acces-non-autoriser');
};

