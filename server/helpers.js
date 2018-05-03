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

  /**
   * computes pagination page;
   * @param { integer } offset
   * @param { integer } limit
   * @param { integer } totalCount
   * @param { integer } pageCount
   * @returns { metaData } object
   */
  static paginationMetadata(offset, limit, totalCount, pageCount) {
    const metaData = {};
    if (!limit) {
      metaData.currentPage = 1;
      if (limit === 0) metaData.limit = 0;
    } else {
      metaData.limt = limit;
      metaData.offset = offset;
      metaData.pageCount = pageCount;
      metaData.totalCount = totalCount;
      metaData.currentPage = Math.ceil((offset + limit) / limit);
      if (offset >= limit) metaData.previousOffset = offset - limit;
      if (metaData.currentPage > 1) {
        metaData.previousPage = metaData.currentPage - 1;
      }
      if (offset + limit < totalCount) {
        metaData.nextOffset = offset + limit;
        metaData.nextPage = metaData.currentPage + 1;
      }
      metaData.endPage = Math.ceil(totalCount / limit);
      metaData.endOffset = (metaData.endPage - 1) * limit;
    }
    return metaData;
  }
}

export default Helpers;
