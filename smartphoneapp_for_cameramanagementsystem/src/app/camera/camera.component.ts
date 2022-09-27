import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebcamImage } from '../modules/webcam/domain/webcam-image';
import { WebcamUtil } from '../modules/webcam/util/webcam.util';
import { WebcamInitError } from '../modules/webcam/domain/webcam-init-error';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit {
  // title = 'live-video-demo';
  // @ViewChild('video') video: ElementRef;
  // ngVersion: string;
  // streaming = false;
  // error: any;
  // private stream: MediaStream = null;
  // private constraints = {
  //   audio: false,
  //   video: true,
  // };

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId!: string;
  public facingMode: string = 'environment';
  public messages: any[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

  public ngOnInit(): void {
    this.readAvailableVideoInputs();
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.messages.push(error);
    if (
      error.mediaStreamError &&
      error.mediaStreamError.name === 'NotAllowedError'
    ) {
      this.addMessage('User denied camera access');
    }
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.addMessage('Received webcam image');
    console.log(webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    this.addMessage('Active device: ' + deviceId);
    this.deviceId = deviceId;
    this.readAvailableVideoInputs();
  }

  addMessage(message: any): void {
    console.log(message);
    this.messages.unshift(message);
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public get videoOptions(): MediaTrackConstraints {
    const result: MediaTrackConstraints = {};
    if (this.facingMode && this.facingMode !== '') {
      result.facingMode = { ideal: this.facingMode };
    }

    return result;
  }

  private readAvailableVideoInputs() {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
  }

  // initVideo(e) {
  //   this.getMediaStream()
  //     .then((stream) => {
  //       this.stream = stream;
  //       this.streaming = true;
  //       this.addMessage("Streaming started")

  //     })
  //     .catch((err) => {
  //       this.streaming = false;
  //       this.error =
  //         err.message + ' (' + err.name + ':' + err.constraintName + ')';
  //     });
  // }
  // private getMediaStream(): Promise<MediaStream> {
  //   const video_constraints = { video: true };
  //   const _video = this.video.nativeElement;
  //   return new Promise<MediaStream>((resolve, reject) => {
  //     // (get the stream)
  //     return navigator.mediaDevices
  //       .getUserMedia(video_constraints)
  //       .then((stream) => {
  //         (<any>window).stream = stream; // make variable available to browser console
  //         _video.srcObject = stream;
  //         // _video.src = window.URL.createObjectURL(stream);
  //         _video.onloadedmetadata = function (e: any) {};
  //         _video.play();
  //         return resolve(stream);
  //       })
  //       .catch((err) => reject(err));
  //   });
  // }
}
