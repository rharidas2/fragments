// src/model/testFragment.js
import { Fragment } from './fragment.js';
import { writeFragmentData, readFragmentData, deleteFragment } from './data/aws/s3Client.js';

async function test() {
  try {
    // Create a new fragment
    const fragment = new Fragment({ ownerId: 'user1', type: 'text/plain' });
    console.log('Created Fragment:', fragment);

    // Set some data for the fragment
    const data = Buffer.from('Hello, this is a test fragment!');
    await fragment.setData(data);
    console.log('Data saved to fragment.');

    // Read the fragment data back
    const readData = await readFragmentData(fragment.id);
    console.log('Read Data from S3:', readData);

    // Delete the fragment
    await deleteFragment(fragment.id);
    console.log('Fragment deleted from S3.');
  } catch (err) {
    console.error('Error testing fragment:', err);
  }
}

test();
