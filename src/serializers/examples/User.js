'use strict';

import {Serializer} from 'jsonapi-serializer';

// Local modules.
import errorHandler from '~/serializers/ErrorHandler.js';

/**
 * @export default {Object}
 */
export default {
  error: errorHandler,

  /**
   * GET request response.
   */
  get: function(data) {
    return (new Serializer('user', {
      attributes: [
        'name',
        'age',
        'gender'
      ]
    })).serialize(data);
  }
};
