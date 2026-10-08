module.exports = (objectPagination, query = {}, countRecords = 0) => {
  const page = Number.parseInt(query.page, 10);
  const limit = Number.parseInt(query.limit, 10);

  objectPagination.currentPage =
    Number.isInteger(page) && page > 0 ? page : objectPagination.currentPage || 1;
  objectPagination.limitItems =
    Number.isInteger(limit) && limit > 0
      ? limit
      : objectPagination.limitItems || 10;

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;
  objectPagination.totalPage =
    objectPagination.limitItems > 0
      ? Math.ceil(countRecords / objectPagination.limitItems)
      : 0;

  return objectPagination;
};