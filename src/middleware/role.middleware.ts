import { NextFunction, Response } from 'express';
import { RequestUserInterface } from '@interface/request-user.interface';
import HttpException from '@exception/http.exception';
import { ROLE_ENUM } from '@enums/role.enum';

export const useRoles = (...roles: ROLE_ENUM[]) => {
  return (req: RequestUserInterface, res: Response, next: NextFunction) => {
    let hasAccess = false;
    roles.forEach((r) => {
      req.user.roles.forEach(r1 => {
        if (r == r1) {
          hasAccess = true;
        }
      })
    })
    if (!hasAccess) {
      next(new HttpException(403, res.__('error.forbidden')))
    } else {
      next()
    }
  }
}