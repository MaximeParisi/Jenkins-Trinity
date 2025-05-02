```sh
npm install @capacitor/android

npx cap init

npx cap add android

npx cap open android # a test


# (avant de run build le client)
npx cap run android
 

# Re build :

npm run build   
npx cap copy
npx cap sync

cd android
./gradlew clean 
./gradlew assembleDebug
```