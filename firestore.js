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

async function getSnapshotForMonth(monthYear) {
  let substrs = monthYear.split('-')
  let nextMonthInt = parseInt(substrs[1]) + 1
  let nextMonth
  if (nextMonthInt === 13) {
    nextMonth = '01'
    substrs[0] = (parseInt(substrs[0]) + 1).toString()
  } else {
    nextMonth = nextMonthInt.toString()
    if (nextMonth.length === 1) {
      nextMonth = '0' + nextMonth
    }
  }
  let endDate = substrs[0] + '-' + nextMonth + '-01T00:00:00'
  let startD = new Date(monthYear + '-01T00:00:00').getTime()
  let endD = new Date(endDate).getTime()
  const snapshot = await db
    .collection(collection)
    .where("timestamp", ">=", startD)
    .where("timestamp", "<", endD)
    .orderBy('timestamp')
    .get();
  return snapshot;
}

async function deleteRec(id) {
  let ref = db.collection(collection).doc(id);
  return await db.recursiveDelete(ref);
}

module.exports = {
  create,
  getSnapshot,
  getSnapshotForMonth,
  deleteRec
};
