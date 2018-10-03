package com.kenestotogo;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.github.yamill.orientation.OrientationPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.modules.i18nmanager.I18nUtil;
import java.util.Arrays;
import java.util.List;
import com.alinz.parkerdan.shareextension.SharePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new OrientationPackage(),
          new FIRMessagingPackage(),
          new RNDeviceInfo(),
          new VectorIconsPackage(),
          new PickerPackage(),
          new RNFetchBlobPackage(),
          new SharePackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
                // FORCE LTR
    I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
    sharedI18nUtilInstance.allowRTL(getApplicationContext(), false);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
