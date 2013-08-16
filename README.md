# Intimate hybrid

This is the hybrid "branch" of the intimate project.

## Framework/Libraries

This solution is based on :
- [AngularJS] (http://angularjs.org/)
- [Cordova] (http://cordova.apache.org/)

I might come soon using a CSS library called "Topcoat".

## Strategy

I try to make the most of the supported HTML5 features. To achieve so, the App is wrapped inside the "standard" WebView of the mobile OS.
Note that the "WebView" isn't quite equivalent to Chrome or Safari or whatever browser you use on the mobiles.

That's where Phonegap/Cordova comes up: it wrappes the app, and provide the "not yet" covered HTML5 features.


### Dev

Getting closed to the mobile:

1. Following the strategy, the browser could be a closed environment to the WebView wrapping the app. Warning: chrome (and friends) covers many HTML5 feature the WebView won't. Double check using [Can I Use...] (http://caniuse.com/)

2. Ripple, a chrome plugin, is helpful to simulate some of the Phonegap features. Unfortunately the last version of Phonegap aren't well covered. I'm currently looking for a better solution. 

3. According the device OS you target, you'll have to install SDK and the IDE. I'm currently focusing on Android, as it covers 80% of the phone in the wild. [Android Studio] (http://developer.android.com/sdk/installing/studio.html) embed everything you need. You can then rely on the Android emulator.

4. And anyway, only a final test on mobile is closed enough. Once the App deployed on the phone, using Android Studio, you can have a look to the WebView logs (console.log()).