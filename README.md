# Circuit Hunt

## Setting up Firebase Admin

To run the seed script, you will need a Firebase Service Account key:

1. Go to your Firebase Console.
2. Navigate to **Project settings > Service accounts**.
3. Click **Generate new private key**.
4. Save the downloaded JSON file to the root of this repository and rename it to `serviceAccountKey.json`.
5. Run the seed script with `node scripts/seed.js`.

**Note:** `serviceAccountKey.json` is added to `.gitignore` and should never be committed to version control.
