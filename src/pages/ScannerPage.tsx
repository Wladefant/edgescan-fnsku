import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { useStore } from '@/lib/store';
import { Camera, Zap, CameraOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SkuEntryDialog } from '@/components/SkuEntryDialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
export function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const setActiveFNSKU = useStore((state) => state.setActiveFNSKU);
  const setDialogOpen = useStore((state) => state.setDialogOpen);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [torchOn, setTorchOn] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const startScan = useCallback(async (deviceId?: string) => {
    if (!videoRef.current) return;
    if (!codeReaderRef.current) {
      codeReaderRef.current = new BrowserMultiFormatReader();
    }
    // Ensure previous camera is reset
    codeReaderRef.current.reset();
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          facingMode: 'environment',
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      setHasPermission(true);
      await codeReaderRef.current.decodeFromStream(stream, videoRef.current, (result, err) => {
        if (result) {
          navigator.vibrate(200);
          setActiveFNSKU(result.getText());
          setDialogOpen(true);
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error('Decode error:', err);
        }
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
      toast.error('Camera permission denied. Please enable it in your browser settings.');
    }
  }, [setActiveFNSKU, setDialogOpen]);
  useEffect(() => {
    const initCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');
        setVideoInputDevices(videoDevices);
        const rearCamera = videoDevices.find((device) => device.label.toLowerCase().includes('back')) || videoDevices[0];
        const deviceId = rearCamera?.deviceId;
        setSelectedDeviceId(deviceId);
        startScan(deviceId);
      } catch (error) {
        console.error('Error enumerating devices:', error);
        setHasPermission(false);
      }
    };
    initCamera();
    return () => {
      codeReaderRef.current?.reset();
    };
  }, [startScan]);
  const switchCamera = () => {
    if (videoInputDevices.length > 1) {
      const currentIndex = videoInputDevices.findIndex((device) => device.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % videoInputDevices.length;
      const nextDevice = videoInputDevices[nextIndex];
      setSelectedDeviceId(nextDevice.deviceId);
      startScan(nextDevice.deviceId);
    }
  };
  const toggleTorch = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const track = stream.getVideoTracks()[0];
      if (!track) return;
      const capabilities = track.getCapabilities() as any;
      if (capabilities.torch) {
        try {
          await track.applyConstraints({ advanced: [{ torch: !torchOn }] } as any);
          setTorchOn(!torchOn);
        } catch (error) {
          console.error('Error toggling torch:', error);
          toast.error('Could not control the flash.');
        }
      } else {
        toast.warning('Flash/Torch not available on this camera.');
      }
    }
  };
  return (
    <div className="relative w-full h-screen bg-black">
      <video ref={videoRef} className="w-full h-full object-cover" playsInline autoPlay muted />
      <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-between p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white font-display" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            EdgeScan FNSKU
          </h1>
        </div>
        <div className="flex-grow flex items-center justify-center">
          {hasPermission === false ? (
            <div className="text-center text-white bg-black/50 p-6 rounded-lg">
              <CameraOff className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h2 className="text-xl font-semibold">Camera Access Denied</h2>
              <p className="text-muted-foreground mt-2">Please grant camera permissions to start scanning.</p>
              <Button onClick={() => startScan(selectedDeviceId)} className="mt-4 bg-amazon-orange text-amazon-blue hover:bg-opacity-90">
                Retry
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-md h-48 border-4 border-dashed border-white/50 rounded-lg animate-pulse" />
          )}
        </div>
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTorch}
            className="bg-black/50 border-white/50 text-white rounded-full w-14 h-14 hover:bg-white/20"
          >
            <Zap className={cn('h-6 w-6', torchOn && 'text-yellow-300 fill-yellow-300')} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={switchCamera}
            className="bg-black/50 border-white/50 text-white rounded-full w-14 h-14 hover:bg-white/20"
            disabled={videoInputDevices.length <= 1}
          >
            <Camera className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <SkuEntryDialog />
    </div>
  );
}