
import React, { useRef, useEffect, useState, useCallback } from 'react';
import Button from '../common/Button';

interface CameraViewProps {
    onClose: () => void;
    onCapture: (imageDataUrl: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onClose, onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } 
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setCameraError("Could not access camera. Please ensure permissions are granted and try uploading a photo instead.");
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCapture = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            onCapture(canvas.toDataURL('image/jpeg'));
        }
    }, [onCapture]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onCapture(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg relative text-center">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">
                    {/* Fix: Resolved 'ion-icon' does not exist on type 'JSX.IntrinsicElements' by moving type definition. */}
                    <ion-icon name="close-circle"></ion-icon>
                </button>
                <h2 className="text-xl font-bold mb-4">Capture Your Meal</h2>
                <div className="bg-slate-200 rounded-lg overflow-hidden aspect-video relative flex items-center justify-center">
                    {!isCameraReady && !cameraError && <div className="text-gray-500">Starting camera...</div>}
                    {cameraError && <p className="text-red-500 p-4">{cameraError}</p>}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className={`w-full h-full object-cover ${isCameraReady ? 'block' : 'hidden'}`}
                        onCanPlay={() => setIsCameraReady(true)}
                    />
                </div>
                <canvas ref={canvasRef} className="hidden" />
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleCapture} disabled={!isCameraReady} className="w-full">
                        {/* Fix: Replaced 'class' with 'className' for React compatibility. */}
                        <ion-icon name="camera" className="mr-2"></ion-icon>
                        Take Photo
                    </Button>
                    <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="w-full">
                        {/* Fix: Replaced 'class' with 'className' for React compatibility. */}
                        <ion-icon name="cloud-upload" className="mr-2"></ion-icon>
                        Upload Photo
                    </Button>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                </div>
            </div>
        </div>
    );
};

export default CameraView;
