import { Marker, InputService } from '@app/input';

export const markers: Marker[] = [
  {
    markerId: 384,
    //markerId: 1,
    secondId: 3,
    job: 'year',
    delay: 30,
    minRotation: 10,
    rotateLeft(inputService: InputService) {
      inputService.puckLeft(this.markerId);
    },
    rotateRight(inputService: InputService) {
      inputService.puckRight(this.markerId);
    }
  },
  {
    markerId: 5,
    secondId: 6,
    job: 'layer',
    delay: 400,
    minRotation: 10,
    rotateLeft(inputService: InputService) {
      inputService.puckLeft(this.markerId);
    },
    rotateRight(inputService: InputService) {
      inputService.puckRight(this.markerId);
    }
  },
  {
    markerId: 11,
    secondId: 9,
    job: 'scenario',
    delay: 600,
    minRotation: 10,
    rotateLeft(inputService: InputService) {
      inputService.puckLeft(this.markerId);
    },
    rotateRight(inputService: InputService) {
      inputService.puckRight(this.markerId);
    }
  },
  {
    markerId: 7,
    secondId: 7,
    job: 'add',
    delay: 800,
    minRotation: 10,
    rotateLeft(inputService: InputService) {
      inputService.puckLeft(this.markerId);
    },
    rotateRight(inputService: InputService) {
      inputService.puckRight(this.markerId);
    }
  }
];