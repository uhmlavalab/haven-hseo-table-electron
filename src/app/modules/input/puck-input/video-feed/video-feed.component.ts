import { Component, OnInit, ViewChild, OnDestroy, Input, ElementRef } from '@angular/core';
import { PuckService } from '../services/puck.service';
import { VideoFeed } from '../interfaces/VideoFeed';

@Component({
  selector: 'app-video-feed',
  templateUrl: './video-feed.component.html',
  styleUrls: ['./video-feed.component.css']
})
export class VideoFeedComponent implements OnInit {

  @ViewChild('videoElement', { static: true }) videoElement: ElementRef;
  @ViewChild('videoCanvas', { static: true }) videoCanvas: ElementRef;
  @ViewChild('canvasWrapper', { static: true }) canvasWrapper: ElementRef;

  @Input() width: number;
  @Input() height: number;
  @Input() feedNumber: number;

  private canvasContext: any;
  private videoElementObj: any;

  constructor(private puckService: PuckService) { }

  ngOnInit() {
    this.canvasWrapper.nativeElement.width = this.width;
    this.canvasWrapper.nativeElement.height = this.height;
    this.videoCanvas.nativeElement.width = this.width;
    this.videoCanvas.nativeElement.height = this.height;
    this.canvasContext = this.videoCanvas.nativeElement.getContext("2d")

    /* Video Data */
    this.videoElementObj =
    {
      id: this.feedNumber,
      video: this.videoElement.nativeElement,
      canvas: {
        element: this.videoCanvas.nativeElement,
        width: this.width,
        height: this.height,
        ctx: this.canvasContext
      },
    } as VideoFeed;

    /* Set Up the Video Feeds */
    navigator.mediaDevices.enumerateDevices().then(this.getDevices)
      .then(feeds => {
        if (feeds.length >= this.feedNumber) {
          this.initCamera(feeds[this.feedNumber], this.videoElement.nativeElement);
        }
      })
      .then(this.puckService.addVideoFeed(this.videoElementObj));
  }

  /* When Closed, clear all video feeds so they can be reopened fresh */
  ngOnDestroy() {
    this.videoElementObj = null;
  }

  private handleVideoError(error) {
    console.log('Missing Video Feed');
  }

  /** Initializes the camera
  * @param feed => The id of the video feed to connect to the video element
  * @param vid => The html video element
  * @return true when completed.
  */
  private initCamera(feed, vid): boolean {
    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: feed }
      }
    }).then(stream => {
      vid.srcObject = stream;
      vid.play();
    }).catch(this.handleVideoError);
    return true;
  }

  /** This function detects the videoinput elements connected to the
  * machine.
  * @param devices => a list of all devices;
  * @return an array of only videoinput devices.
  */
  private getDevices(devices): any[] {
    const videoFeeds: any[] = [];
    devices.forEach(device => {
      if (device.kind === 'videoinput') {
        videoFeeds.push(device.deviceId);
      }
    })
    return videoFeeds;
  }


}
