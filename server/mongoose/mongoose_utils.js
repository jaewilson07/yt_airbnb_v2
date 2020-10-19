const { CRUD_Payload } = require('../graphql/constants');

module.exports = {
  searchLike: (value) => {
    return { $regex: '.*' + value + '.*' };
  },

  createRecord: async (record, Model) => {
    record.createdAt = new Date().toISOString();
    record.updatedAt = new Date().toISOString();

    try {
      const newRecord = new Model(record);

      const res = await newRecord.save();

      return new CRUD_Payload({
        objectId: res.id,
        isSuccess: true,
        data: res,
        message: 'record created',
      });
    } catch (err) {
      return new CRUD_Payload({
        isSuccess: false,
        message: err.message,
      });
    }
  },

  updateRecord: async (
    objectId,
    updateFields,
    user = null,
    recordUserCol = null,
    Model
  ) => {
    try {
      let existingRecord = await Model.findById(objectId);

      let payload = new CRUD_Payload(objectId);

      if (!existingRecord) {
        console.log('message not found');
        payload.message = 'Record not found';

        return payload;
      }

      if (
        existingRecord &&
        user &&
        user.userId !== existingRecord[recordUserCol]
      ) {
        payload.message = 'User not authorized to alter record';
        return payload;
      }

      //update record

      existingRecord.updatedAt = new Date();
      Object.keys(updateFields).forEach(
        (key) => (existingRecord[key] = updateFields[key])
      );

      console.log(existingRecord);

      res = await existingRecord.save();

      payload.data = res;
      payload.isSuccess = true;
      payload.message = 'Record updated';

      return payload;
    } catch (err) {
      console.log(err);

      const payload = new CRUD_Payload(
        ...{
          objectId,
          isSuccess: false,
          message: err.message,
        }
      );

      return payload;
    }
  },
  deleteRecord: async (objectId, user = null, recordUserCol = null, Model) => {
    try {
      const payload = new CRUD_Payload(objectId);

      const existingRecord = await Model.findById(objectId);
      payload.data = existingRecord;

      if (existingRecord && user.userId === existingRecord[recordUserCol]) {
        res = await existingRecord.delete();
        payload.isSuccess = true;
        payload.message = 'Record deleted';
        payload.data = res;
        return payload;
      }

      if (existingRecord && user.userId !== existingRecord[recordUserCol]) {
        payload.message = 'User not authorized to delete this record';
      }

      payload.message = 'Record not Found';
      return payload;
    } catch (err) {
      console.log(err);

      const payload = new CRUD_Payload(
        ...{
          objectId,
          isSuccess: false,
          message: err.message,
        }
      );

      return payload;
    }
  },
};
