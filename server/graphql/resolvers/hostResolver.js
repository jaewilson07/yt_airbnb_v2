const { UserInputError } = require('apollo-server');
const { identity } = require('lodash');
const { searchLike, createRecord } = require('../../mongoose/mongoose_utils');

module.exports = {
  Query: {
    getHosts: async (parent, args, { Hosts }) => {
      try {
        const hosts = await Hosts.find();
        return hosts;
      } catch (err) {
        throw new Error(err);
      }
    },
    searchHost: async (
      parent,
      { searchHost: { field, value } },
      { Hosts },
      info
    ) => {
      try {
        const host = await Hosts.findOne({
          [field]: searchLike(value),
        });

        if (!host) {
          throw new UserInputError('Host not found', {
            errors: {
              id: 'Host not found',
            },
          });
        }

        return host;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    createHost: async (
      parent,
      { name, location, about, neightbourhood },
      { Hosts },
      info
    ) => {
      try {
        const host = await Hosts.findOne({ id });

        if (host) {
          throw new UserInputError('Host already registered', {
            errors: {
              id: 'Host already registered',
            },
          });
        }

        return await createRecord(
          {
            name,
            location,
            about,
            neightbourhood,
          },
          Hosts
        );
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
