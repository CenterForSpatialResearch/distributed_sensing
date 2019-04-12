package com.location_tracker;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.mapbox.rctmgl.RCTMGLPackage;
import cl.json.RNSharePackage;
import com.janeasystems.rn_nodejs_mobile.RNNodeJsMobilePackage;
import com.airbnb.android.react.maps.MapsPackage;
import io.realm.react.RealmReactPackage;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RCTMGLPackage(),
            new RNSharePackage(),
            new RNNodeJsMobilePackage(),
            new MapsPackage(),
            new RealmReactPackage(),
            new RNBackgroundFetchPackage(),
            new RNBackgroundGeolocation()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
