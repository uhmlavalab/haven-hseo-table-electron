import { ElementRef } from "@angular/core";

export interface VideoFeed {
    id: number;
    video: HTMLMediaElement;
    canvas: {
        element: ElementRef,
        width: number,
        height: number,
        ctx: any
    }
}