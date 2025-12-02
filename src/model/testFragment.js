// src/model/testFragment.js

import { writeFragmentData, readFragmentData, deleteFragment } from './data/aws/s3.js';
import { Fragment } from './fragment.js';

async function test() {
  try {
    // Create a new fragment
    const fragment = new Fragment({
      ownerId: 'user123',
      type: 'text/plain',
      size: 0,
    });

    console.log('Fragment created:', fragment);

    // Set some data for the fragment
    const data = Buffer.from('Hello, this is test data!');
    await fragment.setData(data);
    console.log('Fragment data saved.');

    // Upload fragment data to S3
    await writeFragmentData(fragment.id, data);
    console.log('Fragment uploaded to S3.');

    // Read fragment data from S3
    const s3Data = await readFragmentData(fragment.id);
    console.log('Data read from S3:', s3Data);

    // Delete fragment from S3
    await deleteFragment(fragment.id);
    console.log('Fragment deleted from S3.');
  } catch (err) {
    console.error('Error in testFragment:', err);
  }
}

test();
