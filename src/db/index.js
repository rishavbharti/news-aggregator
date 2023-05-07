import QueryResponse from './queryResponse.js';

class Database {
  constructor() {}

  model(name, schema) {
    this[name] = {
      _schema: schema,
      store: {},
    };

    return this;
  }

  validate(name, data, validateOnlyDataFields = false) {
    const validatedData = {};

    for (const [field, properties] of Object.entries(this[name]['_schema'])) {
      const shouldValidate =
        // Validation shouldn't run on default properties - 'id', 'createdAt', 'updatedAt'
        !['id', 'createdAt', 'updatedAt'].includes(field) &&
        // Validate only data fields on update
        (validateOnlyDataFields ? data.hasOwnProperty(field) : true);

      if (shouldValidate) {
        for (const [property, value] of Object.entries(properties)) {
          switch (property) {
            case 'required': {
              if (!data.hasOwnProperty(field)) {
                throw new Error(`Missing required field ${field}.`);
              }
              break;
            }

            case 'type': {
              if (data.hasOwnProperty(field)) {
                const isNotValidType =
                  value === 'Array'
                    ? !Array.isArray(data[field])
                    : typeof data[field] !== value.toLowerCase();

                if (isNotValidType)
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
                validatedData[field] = data[field].trim();
              }
              break;
            }

            case 'lowercase': {
              if (typeof data[field] === 'string') {
                validatedData[field] = data[field].toLowerCase();
              }
              break;
            }

            case 'default': {
              if (!data.hasOwnProperty(field)) validatedData[field] = value;
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

            case 'values': {
              if (data.hasOwnProperty(field)) {
                const hasValidValues = data[field].every((val) =>
                  value.includes(val)
                );

                if (!hasValidValues)
                  throw new Error(`${field} should have values from ${value}.`);
              }
              break;
            }

            case 'match': {
              if (data.hasOwnProperty(field)) {
                const isValidPattern = data[field].match(value?.[0]);
                if (!isValidPattern)
                  throw new Error(value?.[1] || 'Invalid pattern');
              }
              break;
            }

            case 'unique': {
              if (data.hasOwnProperty(field)) {
                const normalizedData = Object.values(this[name].store);
                const valueExists = normalizedData.find(
                  (d) => d[field] === data[field]
                );

                if (valueExists) throw new Error(`${field} is already in use!`);
              }
              break;
            }

            default:
              break;
          }
        }

        if (!validatedData.hasOwnProperty(field))
          validatedData[field] = data[field];
      }
    }

    // Populate 'id' & 'createdAt' only during creation
    if (!validateOnlyDataFields) {
      if (!data.hasOwnProperty('id'))
        validatedData.id = Math.ceil(Date.now().toString() * Math.random());
      if (!data.hasOwnProperty('createdAt'))
        validatedData.createdAt = new Date();
    }
    validatedData.updatedAt = new Date();

    return validatedData;
  }

  write(data) {
    try {
      const schemaName = Object.keys(this)[0];

      const { id, createdAt, updatedAt, ...rest } = data;

      const validatedData = this.validate(schemaName, rest);
      this[schemaName].store[validatedData.id] = validatedData;

      return structuredClone(validatedData);
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

  find(filters = {}) {
    const schemaName = Object.keys(this)[0];
    const filtersLength = Object.entries(filters).length;

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

    return new QueryResponse(structuredClone(filteredData));
  }

  findById(id) {
    const schemaName = Object.keys(this)[0];

    if (!id) throw new Error('ID is required');

    return new QueryResponse(structuredClone(this[schemaName].store[id]));
  }

  findByIdAndUpdate(dataId, data) {
    const schemaName = Object.keys(this)[0];

    if (!dataId) throw new Error('ID is required');
    if (!this[schemaName].store.hasOwnProperty(dataId))
      throw new Error("Couldn't find a record with the given id");

    const { id, createdAt, updatedAt, ...rest } = data;

    const validatedData = this.validate(schemaName, rest, true);

    for (const [key, value] of Object.entries(validatedData)) {
      const typeInSchema = this[schemaName]['_schema'][key]?.type;

      switch (typeInSchema) {
        case 'Array': {
          validatedData[key] = [
            ...this[schemaName].store[dataId][key],
            ...value,
          ];
          break;
        }

        case 'Object': {
          validatedData[key] = {
            ...this[schemaName].store[dataId][key],
            ...value,
          };
          break;
        }

        default:
          break;
      }
    }

    this[schemaName].store[dataId] = {
      ...this[schemaName].store[dataId],
      ...validatedData,
    };

    return new QueryResponse(structuredClone(this[schemaName].store[dataId]));
  }

  deleteOne(filters) {
    const schemaName = Object.keys(this)[0];

    if (!filters) throw new Error('No filters present to identify data.');

    if (filters?.id) {
      if (!this[schemaName].store.hasOwnProperty(filters.id))
        throw new Error("Couldn't find a record with the given id");

      delete this[schemaName].store[filters.id];
      return true;
    }
  }

  deleteAll() {
    const schemaName = Object.keys(this)[0];
    this[schemaName].store = {};

    return true;
  }
}

export default Database;
