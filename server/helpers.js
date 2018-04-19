/**
   * Helpers class;
 */
class Helpers {
  /**
   * generates a response object;
 * @param { any } data
 * @param { string } dataName
 * @param { boolean } success
 * @returns { object } next()
 */
  static getResponse(data, dataName = 'error', success = false) {
    const response = {
      status: success ? 'success' : 'failed',
    };
    response[dataName] = data;
    return response;
  }

  /**
   * sanitizes and validates integer;
 * @param { integer } value
 * @param { string } field
 * @returns { void }
 */
  static sanitizeInteger(value, field) {
    if (!Number.isInteger(value) || [-1, 0, -0].includes(Math.sign(value))) {
      throw new Error(`${field} must be a positive integer`);
    }
    if (value > 2147483647) throw new Error(`${field} too large`);
  }
}

export default Helpers;
