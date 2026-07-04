import mongoose from 'mongoose';
const localUri = 'mongodb://127.0.0.1:27017/test_connection';

async function test() {
  try {
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
    console.log('LOCAL_MONGO_SUCCESS');
    await mongoose.disconnect();
  } catch (e) {
    console.log('LOCAL_MONGO_FAILED');
  }
}

test();
