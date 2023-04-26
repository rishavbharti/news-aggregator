class Database {
  constructor() {}

  model(name, schema) {
    this[name] = {
      _schema: schema,
      store: {},
    };

    return this;
  }

  validate(name, data) {
    for (const [field, properties] of Object.entries(this[name]['_schema'])) {
      // Validation shouldn't run on default properties - 'id', 'createdAt', 'updatedAt'
      if (!['id', 'createdAt', 'updatedAt'].includes(field)) {
        for (const [property, value] of Object.entries(properties)) {
          switch (property) {
            case 'required': {
              if (!data.hasOwnProperty(field)) {
                throw new Error(`Missing required field ${field}.`);
              }
              break;
            }

            case 'type': {
              if (
                data.hasOwnProperty(field) &&
                typeof data[field] !== value.toLowerCase()
              ) {
                throw new Error(`${field} should be of type ${value}.`);
              }
              break;
            }

            case 'minLength': {
              if (data.hasOwnProperty(field) && data[field].length < value) {
                throw new Error(
                  `${field} should have a minimum length of ${value}.`
                );
              }
              break;
            }

            case 'maxLength': {
              if (data.hasOwnProperty(field) && data[field].length > value) {
                throw new Error(
                  `${field} can have a maximum length of ${value}.`
                );
              }
              break;
            }

            case 'trim': {
              if (typeof data[field] === 'string') {
                data[field] = data[field].trim();
              }
              break;
            }

            case 'default': {
              if (!data.hasOwnProperty(field)) data[field] = value;
              break;
            }

            case 'enum': {
              if (data.hasOwnProperty(field) && !value.includes(data[field])) {
                throw new Error(
                  `${field} is an Enum. Should be one of ${value}.`
                );
              }
              break;
            }

            default:
              break;
          }
        }
      }
    }

    // Populate 'id' & 'createdAt' only during creation
    if (!data.hasOwnProperty('id')) data.id = Date.now().toString();
    if (!data.hasOwnProperty('createdAt')) data.createdAt = new Date();

    data.updatedAt = new Date();
  }

  write(data) {
    try {
      const schemaName = Object.keys(this)[0];

      const { id, createdAt, updatedAt, ...rest } = data;

      this.validate(schemaName, rest);
      this[schemaName].store[rest.id] = rest;
      return rest;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  constructFilterString(filters) {
    let filtersArray = [];

    for (const [field, properties] of Object.entries(filters)) {
      if (typeof properties === 'object') {
        for (const [property, value] of Object.entries(properties)) {
          switch (property) {
            // any value in the given array
            case '$in': {
              filtersArray.push(`[${value}].includes(data.${field})`);
              break;
            }

            // less than
            case '$lt': {
              filtersArray.push(`data.${field} < '${value}'`);
              break;
            }

            // greater than
            case '$gt': {
              filtersArray.push(`data.${field} > '${value}'`);
              break;
            }

            default:
              break;
          }
        }
      } else {
        filtersArray.push(`data.${field}.toString() === '${properties}'`);
      }
    }

    return filtersArray.join('&&');
  }

  sort(data, properties) {
    if (!data.length) return;

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

  find(filters = {}, sort = {}) {
    const schemaName = Object.keys(this)[0];
    const filtersLength = Object.entries(filters).length;
    const sortLength = Object.entries(sort).length;

    let filteredData;

    if (!filters || !filtersLength)
      filteredData = Object.values(this[schemaName].store);
    else {
      const filtersString = this.constructFilterString(filters);

      const dataInStore = Object.values(this[schemaName].store);
      filteredData = dataInStore.filter((data) => {
        try {
          return eval(filtersString);
        } catch (error) {
          throw new Error(error);
        }
      });
    }

    if (!sort || !sortLength) return filteredData;

    return this.sort(filteredData, sort);
  }

  findById(id) {
    const schemaName = Object.keys(this)[0];

    if (!id) throw new Error('ID is required');

    return this[schemaName].store[id];
  }

  findByIdAndUpdate(dataId, data) {
    const schemaName = Object.keys(this)[0];

    if (!dataId) throw new Error('ID is required');
    if (!this[schemaName].store.hasOwnProperty(dataId))
      throw new Error("Couldn't find a task with the given id");

    const { id, createdAt, updatedAt, ...rest } = data;

    const validatedData = {
      ...this[schemaName].store[dataId],
      ...rest,
    };

    this.validate(schemaName, validatedData);

    this[schemaName].store[dataId] = validatedData;

    return this[schemaName].store[dataId];
  }

  deleteOne(filters) {
    const schemaName = Object.keys(this)[0];

    if (!filters) throw new Error('No filters present to identify data.');

    if (filters?.id) {
      if (!this[schemaName].store.hasOwnProperty(filters.id))
        throw new Error("Couldn't find a task with the given id");

      delete this[schemaName].store[filters.id];
      return true;
    }
  }
}

export default Database;
