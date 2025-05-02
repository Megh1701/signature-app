import { useEffect, useRef, useState } from "react";
import audio from "../assets/pencil-writing-drawing-loop-3-211894.mp3"
export default function Canvas() {
	const canvasRef = useRef(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const pencilSoundRef = useRef(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		const resizeCanvas = () => {
			const width = window.innerWidth * 0.8;
			const height = window.innerHeight * 0.8;
			canvas.width = width;
			canvas.height = height;

			ctx.fillStyle = "#ededed";
			ctx.fillRect(0, 0, width, height);
		};


		pencilSoundRef.current = new Audio(audio);
		pencilSoundRef.current.loop = true;
		pencilSoundRef.current.volume = 0.3;
		resizeCanvas();

		window.addEventListener("resize", resizeCanvas);
		return () => window.removeEventListener("resize", resizeCanvas);
	}, []);

	const getCoordinates = (e) => {
		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();
		const clientX = e.touches ? e.touches[0].clientX : e.clientX;
		const clientY = e.touches ? e.touches[0].clientY : e.clientY;
		return {
			x: clientX - rect.left,
			y: clientY - rect.top
		};
	};

	const startDrawing = (e) => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		const { x, y } = getCoordinates(e);
		setIsDrawing(true);
		ctx.beginPath();
		ctx.moveTo(x, y);
		if (pencilSoundRef.current) {
			pencilSoundRef.current.currentTime = 0;
			pencilSoundRef.current.play();
		}
	};

	const draw = (e) => {
		if (!isDrawing) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		const { x, y } = getCoordinates(e);
		ctx.lineTo(x, y);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.lineCap = "round";
		ctx.stroke();
	};

	const stopDrawing = () => {
		setIsDrawing(false);
		if (pencilSoundRef.current) {
			pencilSoundRef.current.pause();
		}
	};


	const clearCanvas = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	};

	const downloadImage = () => {
		const canvas = canvasRef.current;
		const link = document.createElement("a");
		link.download = "signature.png";
		link.href = canvas.toDataURL();
		link.click();
	};

	return (
		<div className="h-screen w-full flex justify-center items-center flex-col " style={{ backgroundColor: "#0a0a0a" }}>
			<h2 className="p-2 mb-4 text-2xl" style={{ color: "#ededed" }}>Draw Your Signature</h2>
			<canvas
				ref={canvasRef}
				style={styles.canvas}
				onMouseDown={startDrawing}
				onMouseMove={draw}
				onMouseUp={stopDrawing}
				onMouseLeave={stopDrawing}
				onTouchStart={startDrawing}
				onTouchMove={draw}
				onTouchEnd={stopDrawing}
			/>
			<div className="flex justify-between items-center w-1/5 ">
				<button onClick={clearCanvas} style={{ color: "#ededed" }} className="cursor-pointer p-2 mt-4 flex justify-center gap-1 border-2 rounded-3xl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eraser-icon lucide-eraser"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>erase</button>
				<button onClick={downloadImage} style={{ color: "#ededed" }} className="cursor-pointer p-2 mt-4 flex justify-center gap-1 border-2 rounded-3xl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg> Download</button>
			</div>
		</div>
	);
}

const styles = {

	canvas: {
		border: "2px solid black",
		touchAction: "none",
		width: "80vw",
		height: "80vh"
	},
	buttons: {
		marginTop: "10px"
	},
	button: {
		margin: "0 10px",
		padding: "10px 20px",
		fontSize: "16px",
		cursor: "pointer"
	}
};
