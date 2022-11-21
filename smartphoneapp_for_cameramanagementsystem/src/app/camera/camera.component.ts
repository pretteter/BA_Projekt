import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebcamImage } from '../modules/webcam/domain/webcam-image';
import { WebcamUtil } from '../modules/webcam/util/webcam.util';
import { WebcamInitError } from '../modules/webcam/domain/webcam-init-error';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

// import { ScriptService } from '../services/script-service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
  // providers: [ScriptService],
})
export class CameraComponent implements OnInit, OnDestroy {
  // title = 'live-video-demo';
  video: ElementRef;
  @ViewChild('video', { static: false, read: ElementRef }) set ft(
    video: ElementRef
  ) {
    // console.log(tiles);
    this.video = video;
  }

  ngVersion: string;
  streaming = false;
  error: any;
  stream = null;
  externalHtml;
  private constraints = {
    audio: false,
    video: true,
  };
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private sanitized: DomSanitizer // private script: ScriptService
  ) {}
  // toggle webcam on/off
  showWebcam = true;
  allowCameraSwitch = true;
  multipleWebcamsAvailable = false;
  deviceId!: string;
  facingMode: string = 'environment';
  messages: any[] = [];

  // latest snapshot
  webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

  innerWidth: any;

  ngOnInit(): void {
    // this.script
    //   .load('web-rtc-adapter', 'web-rtc-server')
    //   .then((data) => {
    //     console.log('script loaded ', data);
    //   })
    //   .catch((error) => console.log(error));

    this.readAvailableVideoInputs();
    this.innerWidth = window.innerWidth;

    this.http
      .get('../../assets/streaming_client/index.html', { responseType: 'text' })
      .subscribe(
        (data) =>
          (this.externalHtml = this.sanitized.bypassSecurityTrustHtml(data))
      );

    this.loadJsCssFile('../../assets/streaming_client/webrtc.js', 'script');
    // this.loadJsCssFile('assets/assets/css/styles.css', 'css');
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  handleInitError(error: WebcamInitError): void {
    this.messages.push(error);
    if (
      error.mediaStreamError &&
      error.mediaStreamError.name === 'NotAllowedError'
    ) {
      this.addMessage('User denied camera access');
    }
  }

  showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    // this.video.nativeElement.reload()
    this.nextWebcam.next(directionOrDeviceId);
  }

  handleImage(webcamImage: WebcamImage): void {
    this.addMessage('Received webcam image');
    console.log(webcamImage);
    this.webcamImage = webcamImage;
  }

  cameraWasSwitched(deviceId: string): void {
    this.addMessage('Active device: ' + deviceId);
    this.deviceId = deviceId;
    this.readAvailableVideoInputs();
  }

  addMessage(message: any): void {
    console.log(message);
    this.messages.unshift(message);
    // this.initVideo();
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  get videoOptions(): MediaTrackConstraints {
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

  initStream() {
    // this.getMediaStream()
    //   .then((stream) => {
    //     this.stream = stream;
    //     this.streaming = true;
    //     // this.socketService.sendStream(stream);
    //   })
    //   .catch((err) => {
    //     this.streaming = false;
    //     this.error =
    //       err.message + ' (' + err.name + ':' + err.constraintName + ')';
    //   });
  }

  stopStream() {
    this.reload();
  }

  reload() {
    this.router.navigate([this.router.url]);
  }

  // private getMediaStream(): Promise<MediaStream> {
  //   const video_constraints = { video: true };
  //   const _video = this.video.nativeElement;

  //   return new Promise<MediaStream>((resolve, reject) => {
  //     // (get the stream)
  //     return navigator.mediaDevices
  //       .getUserMedia(video_constraints)
  //       .then((stream) => {
  //         // (<any>window).stream = stream; // make variable available to browser console
  //         _video.srcObject = stream;
  //         // _video.src = window.URL.createObjectURL(stream);
  //         // _video.onloadedmetadata = function (e: any) {};
  //         // _video.play();
  //         return resolve(stream);
  //       })
  //       .catch((err) => reject(err));
  //   });
  // }

  ngOnDestroy(): void {
    // this.socketService.removeAllListeners();
  }

  /////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////

  loadJsCssFile(url: any, type: string) {
    let node: HTMLScriptElement | HTMLLinkElement;
    if (type === 'script') {
      node = document.createElement('script');
      node.src = url;
      node.type = 'text/javascript';
      node.innerHTML = 'pageReady()';
    } else {
      node = document.createElement('link');
      node.href = url;
      node.rel = 'stylesheet';
    }
    document.getElementsByTagName('head')[0].appendChild(node);
  }
}
