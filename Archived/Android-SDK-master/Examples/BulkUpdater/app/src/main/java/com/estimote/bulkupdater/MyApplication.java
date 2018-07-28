package com.estimote.bulkupdater;

import android.app.Application;

import com.estimote.coresdk.common.config.EstimoteSDK;


/**
 * Instance of your application.
 * @author Pawel Dylag (pawel.dylag@estimote.com)
 */
public class MyApplication extends Application {

  @Override
  public void onCreate() {
    super.onCreate();

    // TODO: put your App ID and App Token here
    // You can get them by adding your app on https://cloud.estimote.com/#/apps
    EstimoteSDK.initialize(getApplicationContext(),"<#App ID#>", "<#App Token#>");

    // uncomment to enable debug-level logging
    // it's usually only a good idea when troubleshooting issues with the Estimote SDK
    // EstimoteSDK.enableDebugLogging(true);");
  }
}