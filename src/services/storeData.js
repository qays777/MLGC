const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
  const db = new Firestore();

  try {
    const predictCollection = db.collection('predictions');
    await predictCollection.doc(id).set(data);
  } catch (error) {
    console.error(`Failed to store data: ${error.message}`);
    throw error;
  }
}

module.exports = storeData;
