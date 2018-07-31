package com.estimote.proximitycontent;

import com.estimote.coresdk.service.BeaconManager;

public class NearableScanner extends MainActivity {

    private BeaconManager beaconManager;
    private String scanId;

    @Override
    protected void onCreate() {
        super.onCreate();
        beaconManager = new BeaconManager(this);
        beaconManager.setNearableListener(/* ... */);
    }

    @Override
    protected void onStart() {
        super.onStart();
        beaconManager.connect(new BeaconManager.ServiceReadyCallback() {
            @Override
            public void onServiceReady() {
                scanId = beaconManager.startNearableDiscovery();
            }
        });
    }

    @Override
    protected void onStop() {
        super.onStop();
        beaconManager.stopNearableDiscovery(scanId);
    }
}
