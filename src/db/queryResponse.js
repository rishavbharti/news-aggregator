// This class contains additional utility methods that can be executed after reading data from the database.
class QueryResponse {
  constructor(res) {
    this.res = res;
  }

  sort(properties) {
    if (!this.res.length) return;

    const { sortBy = 'id', orderBy = 'asc' } = properties;

    return data.sort((a, b) => {
      if (!a.hasOwnProperty(sortBy)) throw new Error('Invalid sort property');

      switch (orderBy) {
        case 'asc': {
          return a[sortBy] - b[sortBy];
        }

        case 'desc': {
          return b[sortBy] - a[sortBy];
        }

        default:
          throw new Error('Invalid order property');
      }
    });
  }
}

export default QueryResponse;
