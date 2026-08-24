// Full CRUD against MongoDB using the official `mongodb` driver directly
// (no ODM like Mongoose), to see what an ODM abstracts away.
//
// Requires a running MongoDB instance. Set MONGODB_URI, e.g.:
//   export MONGODB_URI=mongodb://localhost:27017
//
// Run: node mongo-crud.js
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
// The driver's default serverSelectionTimeoutMS is 30s, which reads as a
// hang for a demo script — fail fast instead so the catch block below
// reports a clear error quickly when no MongoDB instance is reachable.
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 });

async function withCollection(fn) {
  await client.connect();
  try {
    const db = client.db('learning_nodejs');
    return await fn(db.collection('notes'));
  } finally {
    await client.close();
  }
}

async function createNote(title) {
  return withCollection(async (notes) => {
    const result = await notes.insertOne({ title, createdAt: new Date() });
    return { _id: result.insertedId, title };
  });
}

async function listNotes() {
  return withCollection((notes) => notes.find().toArray());
}

async function updateNote(id, title) {
  return withCollection(async (notes) => {
    const result = await notes.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { title } },
      { returnDocument: 'after' }
    );
    return result;
  });
}

async function deleteNote(id) {
  return withCollection(async (notes) => {
    const result = await notes.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  });
}

async function main() {
  const created = await createNote('Learn the MongoDB driver');
  console.log('created:', created);

  console.log('all notes:', await listNotes());

  const updated = await updateNote(created._id, 'Learn the MongoDB driver (done)');
  console.log('updated:', updated);

  const deleted = await deleteNote(created._id);
  console.log('deleted:', deleted);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('mongo-crud demo failed — is MongoDB running and MONGODB_URI set?', err.message);
    process.exitCode = 1;
  });
}

module.exports = { createNote, listNotes, updateNote, deleteNote };
