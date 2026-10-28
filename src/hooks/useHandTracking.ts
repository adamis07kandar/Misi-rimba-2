import { useEffect, useRef, useState, useCallback } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

export interface HandPoint {
  x: number;
  y: number;
}

export interface HandTrackingState {
  isSupported: boolean;
  isCameraActive: boolean;
  isLoading: boolean;
  error: string | null;
  handDetected: boolean;
  isPinching: boolean;
  dwellProgress: number; // 0 to 1
  cursorPos: HandPoint;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  toggleCamera: () => Promise<void>;
  useMouseFallback: boolean;
  setUseMouseFallback: (val: boolean) => void;
  triggerManualClickAtCursor: () => void;
}

export function useHandTracking(): HandTrackingState {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [handDetected, setHandDetected] = useState<boolean>(false);
  const [isPinching, setIsPinching] = useState<boolean>(false);
  const [dwellProgress, setDwellProgress] = useState<number>(0);
  const [useMouseFallback, setUseMouseFallback] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState<HandPoint>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Smoothing and dwell refs
  const smoothedPosRef = useRef<HandPoint>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const dwellAnchorPosRef = useRef<HandPoint>({ x: 0, y: 0 });
  const dwellStartTimeRef = useRef<number>(0);
  const wasPinchingRef = useRef<boolean>(false);

  // Initialize MediaPipe HandLandmarker
  useEffect(() => {
    let isMounted = true;
    async function loadLandmarker() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        if (!isMounted) return;

        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 1
        });

        if (isMounted) {
          handLandmarkerRef.current = landmarker;
        }
      } catch (err: any) {
        console.warn('MediaPipe HandLandmarker init error:', err);
        // Fallback to mouse tracking if CDN or WebGL fails
        if (isMounted) {
          setUseMouseFallback(true);
        }
      }
    }

    loadLandmarker();

    return () => {
      isMounted = false;
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
      }
    };
  }, []);

  // Mouse fallback listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isCameraActive || useMouseFallback) {
        setCursorPos({ x: e.clientX, y: e.clientY });
        smoothedPosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isCameraActive, useMouseFallback]);

  // Execute synthetic click at point
  const triggerClickAt = useCallback((x: number, y: number) => {
    const el = document.elementFromPoint(x, y);
    if (el) {
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
      });
      el.dispatchEvent(clickEvent);

      // If button or interactive element, trigger focus or native click
      if (el instanceof HTMLElement) {
        el.click();
      }
    }
  }, []);

  const triggerManualClickAtCursor = useCallback(() => {
    triggerClickAt(smoothedPosRef.current.x, smoothedPosRef.current.y);
  }, [triggerClickAt]);

  // Video processing loop
  const processVideo = useCallback(() => {
    const video = videoRef.current;
    const landmarker = handLandmarkerRef.current;
    const canvas = canvasRef.current;

    if (video && video.readyState >= 2 && landmarker) {
      const now = performance.now();
      const results = landmarker.detectForVideo(video, now);

      // Draw mini camera skeleton on canvas
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Mirror preview
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
          ctx.restore();
        }
      }

      if (results.landmarks && results.landmarks.length > 0) {
        setHandDetected(true);
        const landmarks = results.landmarks[0];

        // Landmark 8 is INDEX_FINGER_TIP
        const indexTip = landmarks[8];
        // Landmark 4 is THUMB_TIP
        const thumbTip = landmarks[4];

        if (indexTip && canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Draw detected fingertip in mini PIP
            const pipX = (1 - indexTip.x) * canvas.width; // Mirrored
            const pipY = indexTip.y * canvas.height;
            ctx.beginPath();
            ctx.arc(pipX, pipY, 6, 0, 2 * Math.PI);
            ctx.fillStyle = '#f59e0b';
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 8;
            ctx.fill();
          }

          // Calculate screen position (mirrored along X axis for natural mirror interaction)
          const targetX = (1 - indexTip.x) * window.innerWidth;
          const targetY = indexTip.y * window.innerHeight;

          // Smooth exponential filter (alpha = 0.35)
          const alpha = 0.35;
          const currentX = smoothedPosRef.current.x + (targetX - smoothedPosRef.current.x) * alpha;
          const currentY = smoothedPosRef.current.y + (targetY - smoothedPosRef.current.y) * alpha;

          smoothedPosRef.current = { x: currentX, y: currentY };
          setCursorPos({ x: currentX, y: currentY });

          // Pinch gesture calculation (distance between thumb and index tip)
          if (thumbTip) {
            const dx = (thumbTip.x - indexTip.x);
            const dy = (thumbTip.y - indexTip.y);
            const dz = (thumbTip.z - indexTip.z);
            const pinchDist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const pinching = pinchDist < 0.085;

            setIsPinching(pinching);

            // Trigger click on pinch down
            if (pinching && !wasPinchingRef.current) {
              triggerClickAt(currentX, currentY);
            }
            wasPinchingRef.current = pinching;
          }

          // Dwell detection (holding finger steady over an element for 1.1s)
          const anchorDx = Math.abs(currentX - dwellAnchorPosRef.current.x);
          const anchorDy = Math.abs(currentY - dwellAnchorPosRef.current.y);

          if (anchorDx < 28 && anchorDy < 28) {
            const elapsed = performance.now() - dwellStartTimeRef.current;
            const progress = Math.min(1, elapsed / 1100);
            setDwellProgress(progress);

            if (progress >= 1 && dwellStartTimeRef.current > 0) {
              triggerClickAt(currentX, currentY);
              // Reset dwell so it doesn't repeatedly click
              dwellStartTimeRef.current = performance.now() + 800;
              setDwellProgress(0);
            }
          } else {
            dwellAnchorPosRef.current = { x: currentX, y: currentY };
            dwellStartTimeRef.current = performance.now();
            setDwellProgress(0);
          }
        }
      } else {
        setHandDetected(false);
        setIsPinching(false);
        setDwellProgress(0);
      }
    }

    animFrameRef.current = requestAnimationFrame(processVideo);
  }, [triggerClickAt]);

  // Start / Stop camera
  const toggleCamera = useCallback(async () => {
    if (isCameraActive) {
      // Turn off
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      setIsCameraActive(false);
      setHandDetected(false);
      setDwellProgress(0);
    } else {
      // Turn on
      setIsLoading(true);
      setError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          },
          audio: false
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setIsCameraActive(true);
        setIsLoading(false);
        setUseMouseFallback(false);

        // Start frame processing
        animFrameRef.current = requestAnimationFrame(processVideo);
      } catch (err: any) {
        console.error('Camera access error:', err);
        setError(err.message || 'Kamera tidak dapat diakses');
        setIsLoading(false);
        setIsCameraActive(false);
        setUseMouseFallback(true);
      }
    }
  }, [isCameraActive, processVideo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return {
    isSupported: typeof navigator !== 'undefined' && !!navigator.mediaDevices,
    isCameraActive,
    isLoading,
    error,
    handDetected,
    isPinching,
    dwellProgress,
    cursorPos,
    videoRef,
    canvasRef,
    toggleCamera,
    useMouseFallback,
    setUseMouseFallback,
    triggerManualClickAtCursor
  };
}
