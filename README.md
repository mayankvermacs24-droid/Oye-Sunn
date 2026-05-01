to run the file:-
cd oyee-sun
npx expo start (if same network)
npx expo start --tunnel (if different network)

API keys placement:-

src/config/keys.js → Line 13 — replace 'YOUR_GOOGLE_API_KEY_HERE'
app.json → Line 37 — replace "YOUR_GOOGLE_API_KEY_HERE"
Both must be the same key with Places API, Maps SDK for Android, and Geocoding API enabled.

Important: After adding the key to app.json, you'll need to do npx expo prebuild --clean or create a new development build since Maps SDK config is a native change (won't work in Expo Go).
