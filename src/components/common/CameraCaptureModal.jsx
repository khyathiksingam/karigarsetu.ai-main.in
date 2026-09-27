import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, SwitchCamera, AlertCircle, Check, RotateCcw, Sparkles } from 'lucide-react';

const getCameraErrorMessage = (error) => {
  if (!error) {
    return 'Camera capture is not supported in this browser. Please use Browse File instead.';
  }

  switch (error.name) {
    case 'NotAllowedError':
      return 'Camera permission was denied. Please allow camera access in your browser settings.';
    case 'NotFoundError':
      return 'No camera was detected on this device.';
    case 'NotReadableError':
      return 'The camera is being used by another application.';
    case 'OverconstrainedError':
      return 'This camera configuration is not supported on this device. Please try again.';
    case 'SecurityError':
      return 'Camera access is blocked by the browser security policy.';
    case 'AbortError':
      return 'Camera access was interrupted. Please try again.';
    case 'TypeError':
      return 'Camera access is unavailable in this browser or context.';
    default:
      return 'Camera capture is not supported in this browser. Please use Browse File instead.';
  }
};

export const CameraCaptureModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mobileCameraInputRef = useRef(null);
  const capturedFileRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [cameraError, setCameraError] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (error) {
          console.warn('Camera track stop warning:', error);
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (error) {
        console.warn('Video pause warning:', error);
      }
      videoRef.current.srcObject = null;
    }

    setCameraReady(false);
  };

  const closeModal = () => {
    stopCamera();
    capturedFileRef.current = null;
    setCapturedImage(null);
    setCameraError('');
    setIsInitializing(false);
    onClose();
  };

  const handleMobileCameraCapture = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onCapture(file);
    closeModal();
    event.target.value = '';
  };

  const startCamera = async (nextFacingMode = facingMode) => {
    stopCamera();
    setIsCapturing(false);
    setCapturedImage(null);
    capturedFileRef.current = null;
    setCameraError('');
    setIsInitializing(true);
    setCameraReady(false);

    if (typeof window === 'undefined') {
      return;
    }

    if (!window.isSecureContext) {
      console.warn('Camera access requires a secure context: window.isSecureContext =', window.isSecureContext);
      setCameraError('Camera access requires HTTPS or localhost. Please use a secure browser context and allow camera permission.');
      setIsInitializing(false);
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const error = new TypeError('Camera API is unavailable in this browser or context.');
      console.warn('Camera API unavailable:', error.name, error.message);
      setCameraError(getCameraErrorMessage(error));
      setIsInitializing(false);
      return;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      setHasMultipleCameras(videoDevices.length > 1);

      const preferredConstraints = {
        video: {
          facingMode: { ideal: nextFacingMode === 'user' ? 'user' : 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      let mediaStream;

      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(preferredConstraints);
      } catch (preferredError) {
        console.warn('Preferred camera constraints failed:', preferredError.name, preferredError.message);

        if (preferredError?.name === 'OverconstrainedError' || preferredError?.name === 'NotFoundError') {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        } else {
          throw preferredError;
        }
      }

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('autoplay', 'true');

        const handleLoadedMetadata = () => {
          if (!videoRef.current) return;
          const { videoWidth, videoHeight } = videoRef.current;
          if (videoWidth > 0 && videoHeight > 0) {
            setCameraReady(true);
            setIsInitializing(false);
          } else {
            setCameraReady(false);
            setIsInitializing(true);
          }
        };

        videoRef.current.onloadedmetadata = handleLoadedMetadata;

        try {
          await videoRef.current.play();
        } catch (playError) {
          console.warn('Video play() failed:', playError);
        }
      }
    } catch (error) {
      console.warn('Camera initialization failed:', error.name, error.message);
      setIsInitializing(false);
      setCameraError(getCameraErrorMessage(error));
      stopCamera();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setCameraError('');
      capturedFileRef.current = null;
      return;
    }

    startCamera(facingMode);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopCamera();
      setCapturedImage(null);
      capturedFileRef.current = null;
    };
  }, [isOpen, facingMode]);

  const handleSwitchCamera = async () => {
    const nextFacingMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacingMode);
    await startCamera(nextFacingMode);
  };

  const handleCaptureFrame = () => {
    if (!videoRef.current || !streamRef.current) {
      return;
    }

    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0 || video.readyState < 2) {
      return;
    }

    setIsCapturing(true);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      setCameraError('Unable to process the camera frame. Please try again.');
      setIsCapturing(false);
      return;
    }

    if (facingMode === 'user') {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError('Unable to capture the image. Please try again.');
          setIsCapturing(false);
          return;
        }

        const file = new File([blob], `karigarsetu-camera-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });

        capturedFileRef.current = file;
        setCapturedImage(canvas.toDataURL('image/jpeg', 0.92));
        stopCamera();
        setIsCapturing(false);
      },
      'image/jpeg',
      0.9
    );
  };

  const handleUsePhoto = () => {
    if (!capturedFileRef.current) {
      return;
    }

    onCapture(capturedFileRef.current);
    closeModal();
  };

  const handleRetake = async () => {
    stopCamera();
    capturedFileRef.current = null;
    setCapturedImage(null);
    setCameraError('');
    await startCamera(facingMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-heritage-charcoal rounded-3xl overflow-hidden border border-heritage-gold/40 shadow-3d-lg max-w-xl w-full flex flex-col relative text-white">
        <div className="p-4 bg-heritage-brown/90 flex items-center justify-between border-b border-heritage-gold/30">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-heritage-terracotta flex items-center justify-center text-white">
              <Camera className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-heritage-gold-light">Artisan Live Camera Scanner</h3>
              <p className="text-[10px] text-heritage-sand/70">Align the handicraft within the frame</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close camera"
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center space-y-3 max-w-sm">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" aria-hidden="true" />
              <p className="text-xs text-heritage-sand/90 font-medium leading-relaxed">{cameraError}</p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="px-4 py-2 bg-heritage-terracotta text-white rounded-xl text-xs font-bold shadow-md hover:bg-heritage-terracotta-dark transition focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => mobileCameraInputRef.current?.click()}
                  className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-bold shadow-md hover:bg-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold"
                >
                  Use Mobile Camera
                </button>
              </div>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured handicraft preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              <div className="absolute inset-8 border border-white/30 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-l-2 border-heritage-gold absolute top-0 left-0" />
                <div className="w-8 h-8 border-t-2 border-r-2 border-heritage-gold absolute top-0 right-0" />
                <div className="w-8 h-8 border-b-2 border-l-2 border-heritage-gold absolute bottom-0 left-0" />
                <div className="w-8 h-8 border-b-2 border-r-2 border-heritage-gold absolute bottom-0 right-0" />
                <Sparkles className="w-6 h-6 text-heritage-gold/50 animate-pulse" aria-hidden="true" />
              </div>

              {isInitializing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center space-x-2 text-xs font-bold text-heritage-gold-light">
                  <RefreshCw className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Starting camera...</span>
                </div>
              )}
            </>
          )}

          <input
            ref={mobileCameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleMobileCameraCapture}
          />
        </div>

        <div className="p-4 bg-heritage-brown/95 border-t border-heritage-gold/20 flex items-center justify-between gap-3">
          <button
            type="button"
            aria-label="Switch camera"
            disabled={Boolean(cameraError) || !hasMultipleCameras || isInitializing || cameraReady === false}
            onClick={handleSwitchCamera}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-heritage-gold-light transition disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold"
          >
            <SwitchCamera className="w-4 h-4" aria-hidden="true" />
          </button>

          {!capturedImage ? (
            <button
              type="button"
              aria-label="Capture photo"
              disabled={Boolean(cameraError) || isInitializing || isCapturing || !cameraReady}
              onClick={handleCaptureFrame}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-heritage-terracotta to-heritage-gold p-1 shadow-glow-terracotta hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold"
            >
              <div className="w-13 h-13 rounded-full bg-white flex items-center justify-center text-heritage-brown">
                <Camera className="w-6 h-6 text-heritage-terracotta" aria-hidden="true" />
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Retake photo"
                onClick={handleRetake}
                className="px-3 py-2 rounded-xl bg-white/10 text-xs font-bold hover:bg-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold"
              >
                <span className="inline-flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  Retake
                </span>
              </button>
              <button
                type="button"
                aria-label="Use captured photo"
                onClick={handleUsePhoto}
                className="px-3 py-2 rounded-xl bg-heritage-terracotta text-white text-xs font-bold hover:bg-heritage-terracotta-dark transition focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  Use Photo
                </span>
              </button>
            </div>
          )}

          <button
            type="button"
            aria-label="Browse files for photo upload"
            onClick={closeModal}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-heritage-sand transition focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
