'use strict';

const {Firestore} = require('@google-cloud/firestore');
const db = new Firestore();
const collection = 'service-requests';

async function update(id, data) {
  let ref;
  if (id === null) {
    ref = db.collection(collection).doc();
  } else {
    ref = db.collection(collection).doc(id);
  }
  data.id = ref.id;
  data = {...data};
  await ref.set(data);
  return data;
}

async function create(data) {
  return await update(null, data);
}

async function getSnapshot() {
  const snapshot = await db
    .collection(collection)
    .orderBy('timestamp')
    .get();
  return snapshot;
}

module.exports = {
  create,
  getSnapshot
};
