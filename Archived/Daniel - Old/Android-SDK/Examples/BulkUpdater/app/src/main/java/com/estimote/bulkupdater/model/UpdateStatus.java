package com.estimote.bulkupdater.model;


import com.estimote.coresdk.recognition.utils.DeviceId;
import com.estimote.mgmtsdk.feature.bulk_updater.BulkUpdater;

/**
 * A simple model for holding info about each device update status.
 * @author Pawel Dylag (pawel.dylag@estimote.com)
 */
public class UpdateStatus {

  public DeviceId deviceId;
  public BulkUpdater.Status status;
  public String message;

  public UpdateStatus(DeviceId deviceId, BulkUpdater.Status status, String message) {
    this.deviceId = deviceId;
    this.status = status;
    this.message = message;
  }
}
