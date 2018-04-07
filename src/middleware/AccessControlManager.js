'use strict';

import {AccessControl} from 'accesscontrol';
import config          from 'config';

/**
 * Middleware to manage access based on ABAC (Attribute-Based Access Control).
 *
 * @see https://www.npmjs.com/package/accesscontrol
 *
 * @export default {Function}
 */
export default (req, res, next) => {
  let resource = req.url;

  // Skip public routes.
  let excludePaths = config.get('router.accessControl.excludePaths');

  if (excludePaths.includes(resource)) {
    return next();
  }

  // Check grants exist.
  let grantsObject = config.get('router.accessControl.grantsObject');

  if (grantsObject === undefined) {
    return next();
  }

  let ac = new AccessControl(grantsObject);

  // Get role from session store.
  if (req.session) {
    let permission;

    // Check permissions.
    switch (req.method) {
      case 'POST':
        permission = ac.can(req.session.role)
          .createAny(resource);
        break;

      case 'PATCH':
      case 'PUT':
        permission = ac.can(req.session.role)
          .updateAny(resource);
        break;

      case 'DELETE':
        permission = ac.can(req.session.role)
          .deleteAny(resource);
        break;

      default:
        permission = ac.can(req.session.role)
          .readAny(resource);
    }

    if (permission.granted) {
      return next();
    }
  }

  res.status(401).json({});
  res.end();
};
