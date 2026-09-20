plugins { id("com.android.application") }

android {
    namespace = "com.sentinela.mobile"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.sentinela.mobile"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release { isMinifyEnabled = false }
    }
}
