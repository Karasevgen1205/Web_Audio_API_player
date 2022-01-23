const url = "src/audio/sig.mp3";

let ctx = new (window.AudioContext || window.webkitAudioContext)();
let gainNode = ctx.createGain();
gainNode.connect(ctx.destination);

let buffer;
let sourceNode;

let startedAt;
let pausedAt;
let paused = true;
let newTime;
const playBtn = document.querySelector(".play");
playBtn.setAttribute("disabled", "disabled");
const stopBtn = document.querySelector(".stop");
const valueControl = document.querySelector(".value-control");
const valueValue = document.querySelector(".value-value");
const trackValue = document.querySelector(".track-control");

function load(url) {
	const request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";
	request.onload = function () {
		ctx.decodeAudioData(request.response, onBufferLoad, onBufferError);
	};
	request.send();
}
load(url);

function play(newTime = 0) {
	sourceNode = ctx.createBufferSource();
	sourceNode.connect(gainNode);
	sourceNode.connect(ctx.destination);
	sourceNode.buffer = buffer;
	gainNode.gain.value = valueControl.value;
	paused = false;

	if (pausedAt) {
		startedAt = Date.now() - pausedAt;
		// if(newTime === pausedAt) {
		// 	sourceNode.start(0, pausedAt / 1000);
		// }
		ourceNode.start(0, pausedAt / 1000);
	} else {
		startedAt = Date.now();
		sourceNode.start(0, newTime);
	}
}

function pause() {
	sourceNode.stop(0);
	pausedAt = Date.now() - startedAt;
	paused = true;
}

function onBufferLoad(b) {
	buffer = b;
	playBtn.removeAttribute("disabled");
}

function onBufferError(e) {
	console.log("onBufferError", e);
}

playBtn.onclick = () => {
	if (paused) {
		play(newTime);
		playBtn.innerHTML = "Pause";
	} else {
		pause();
		playBtn.innerHTML = "Play";
	}
};

stopBtn.onclick = () => {
	sourceNode.stop(0);
	sourceNode = ctx.createBufferSource();
	sourceNode.connect(gainNode);
	sourceNode.connect(ctx.destination);
	gainNode.gain.value = valueControl.value;
	paused = true;
	startedAt = 0;
	pausedAt = 0;
	trackValue.value = 0;
	playBtn.innerHTML = "Play";
};

valueControl.oninput = () => {
	gainNode.gain.value = valueControl.value;
	valueValue.innerHTML = Math.round((valueControl.value * 100 + 100) / 2);
};

trackValue.onchange = () => {
	if (!paused) {
		let value = Math.round(trackValue.value * 100);
		newTime = (sourceNode.buffer.duration / 100) * value;
		sourceNode.stop(0);
		play(newTime);
		// console.log((pausedAt = Math.round(newTime * 1000)));
	}
};
//////////////////////////////////////////////////////////////////
// const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// let source = audioCtx.createBufferSource();
// let buffer;
// let isPlay = false;
// // let timeStart = 0;
// // let timeEnd = 0;
// // let timeOffset = 0;
// let startedAt;
// let pausedAt;
// let paused;

// const playBtn = document.querySelector(".play");
// const stopBtn = document.querySelector(".stop");

// const valueControl = document.querySelector(".value-control");
// const valueValue = document.querySelector(".value-value");

// var gainNode = audioCtx.createGain();
// gainNode.connect(audioCtx.destination);

// fetch("src/audio/sig.mp3")
// 	.then((resp) => resp.arrayBuffer())
// 	.then((buffer) => audioCtx.decodeAudioData(buffer))
// 	.then((decoded) => {
// 		source.buffer = buffer = decoded;
// 		source.loop = true;

// 		source.connect(gainNode);
// 		gainNode.gain.value = valueControl.value;
// 	});

// const start = () => {
// 	// timeEnd = new Date();
// 	// timeOffset = (timeEnd - timeStart) / 1000;
// 	source.stop(0);
// 	source = audioCtx.createBufferSource();
// 	source.buffer = buffer;
// 	source.loop = true;
// 	source.connect(gainNode);
// 	isPlay = false;
// 	playBtn.innerHTML = "Play";
// };

// const pause = () => {
// 	// timeStart = new Date();
// 	// source.start(0, timeOffset);
// 	source.start(0);
// 	isPlay = true;
// 	playBtn.innerHTML = "Pause";
// };

// playBtn.onclick = () => {
// 	isPlay ? start() : pause();
// };

// stopBtn.onclick = () => {
// 	if (isPlay) {
// 		source.stop(0);
// 		source = audioCtx.createBufferSource();
// 		source.buffer = buffer;
// 		source.loop = true;
// 		source.connect(gainNode);
// 		isPlay = false;
// 		// timeOffset = 0;
// 	}
// };

// valueControl.oninput = () => {
// 	gainNode.gain.value = valueControl.value;
// 	valueValue.innerHTML = Math.round(valueControl.value * 100);
// };

// // let audioCtx;
// // let source;
// // let songLength;
// // let gainNode;

// // const play = document.querySelector(".play");
// // const stop = document.querySelector(".stop");
// // stop.setAttribute("disabled", "disabled");
// // const pause = document.querySelector(".pause");

// // // const playbackControl = document.querySelector(".playback-rate-control");
// // // const playbackValue = document.querySelector(".playback-rate-value");
// // // playbackControl.setAttribute("disabled", "disabled");

// // // const loopstartControl = document.querySelector(".loopstart-control");
// // // const loopstartValue = document.querySelector(".loopstart-value");
// // // loopstartControl.setAttribute("disabled", "disabled");

// // // const loopendControl = document.querySelector(".loopend-control");
// // // const loopendValue = document.querySelector(".loopend-value");
// // // loopendControl.setAttribute("disabled", "disabled");

// // const valueControl = document.querySelector(".value-control");
// // const valueValue = document.querySelector(".value-value");
// // // valueControl.setAttribute("disabled", "disabled");

// // play.onclick = () => {
// // 	audioCtx = window.webkitAudioContext
// // 		? new window.webkitAudioContext()
// // 		: new window.AudioContext();

// // 	source = audioCtx.createBufferSource();
// // 	gainNode = audioCtx.createGain();
// // 	gainNode.connect(audioCtx.destination);

// // 	request = new XMLHttpRequest();
// // 	request.open("GET", "src/audio/rek.mp3", true);
// // 	request.responseType = "arraybuffer";

// // 	request.onload = function () {
// // 		audioCtx.decodeAudioData(
// // 			request.response,
// // 			function (buffer) {
// // 				songLength = buffer.duration;
// // 				source.buffer = buffer;
// // 				// source.playbackRate.value = playbackControl.value;
// // 				source.connect(gainNode);
// // 				gainNode.gain.value = 0;
// // 				source.connect(audioCtx.destination);
// // 				// source.loop = true;
// // 				// loopstartControl.setAttribute("max", Math.floor(songLength));
// // 				// loopendControl.setAttribute("max", Math.floor(songLength));
// // 			},

// // 			function (e) {
// // 				"Error with decoding audio data" + e.error;
// // 			}
// // 		);
// // 	};

// // 	request.send();
// // 	source.start(0);
// // 	play.setAttribute("disabled", "disabled");
// // 	stop.removeAttribute("disabled");
// // 	// playbackControl.removeAttribute("disabled");
// // 	// loopstartControl.removeAttribute("disabled");
// // 	// loopendControl.removeAttribute("disabled");
// // 	// valueControl.removeAttribute("disabled");
// // };

// // stop.onclick = () => {
// // 	source.stop(0);
// // 	play.removeAttribute("disabled");
// // 	stop.setAttribute("disabled", "disabled");
// // 	// playbackControl.setAttribute("disabled", "disabled");
// // 	// loopstartControl.setAttribute("disabled", "disabled");
// // 	// loopendControl.setAttribute("disabled", "disabled");
// // 	// valueControl.setAttribute("disabled", "disabled");
// // };

// // pause.onclick = () => {
// // 	currentTime = source.context.currentTime;
// // 	console.log(currentTime);
// // 	console.log(source);
// // };

// // valueControl.oninput = () => {
// // 	console.log(valueControl.value);
// // };

// /////////////////////////////////////

// // let audioCtx;
// // let source;
// // let songLength;
// // let gainNode;

// // const play = document.querySelector(".play");
// // const stop = document.querySelector(".stop");
// // stop.setAttribute("disabled", "disabled");
// // const pause = document.querySelector(".pause");

// // // const playbackControl = document.querySelector(".playback-rate-control");
// // // const playbackValue = document.querySelector(".playback-rate-value");
// // // playbackControl.setAttribute("disabled", "disabled");

// // // const loopstartControl = document.querySelector(".loopstart-control");
// // // const loopstartValue = document.querySelector(".loopstart-value");
// // // loopstartControl.setAttribute("disabled", "disabled");

// // // const loopendControl = document.querySelector(".loopend-control");
// // // const loopendValue = document.querySelector(".loopend-value");
// // // loopendControl.setAttribute("disabled", "disabled");

// // const valueControl = document.querySelector(".value-control");
// // const valueValue = document.querySelector(".value-value");
// // // valueControl.setAttribute("disabled", "disabled");

// // function getData() {
// // 	if (window.webkitAudioContext) {
// // 		audioCtx = new window.webkitAudioContext();
// // 	} else {
// // 		audioCtx = new window.AudioContext();
// // 	}
// // 	gainNode = audioCtx.createGain(); // Create a gainNode reference.
// // 	gainNode.connect(audioCtx.destination);
// // 	// gain = new GainNode(audioCtx);
// // 	// gain = audioCtx.creategain();

// // 	source = audioCtx.createBufferSource();

// // 	request = new XMLHttpRequest();
// // 	request.open("GET", "src/audio/rek.mp3", true);
// // 	request.responseType = "arraybuffer";

// // 	request.onload = function () {
// // 		let audioData = request.response;

// // 		audioCtx.decodeAudioData(
// // 			audioData,
// // 			function (buffer) {
// // 				songLength = buffer.duration;
// // 				source.buffer = buffer;
// // 				// source.playbackRate.value = playbackControl.value;
// // 				source.connect(gainNode);
// // 				gainNode.gain.value = 0;
// // 				source.connect(audioCtx.destination);
// // 				// source.loop = true;
// // 				// loopstartControl.setAttribute("max", Math.floor(songLength));
// // 				// loopendControl.setAttribute("max", Math.floor(songLength));
// // 			},

// // 			function (e) {
// // 				"Error with decoding audio data" + e.error;
// // 			}
// // 		);
// // 	};

// // 	request.send();
// // }

// // play.onclick = () => {
// // 	getData();
// // 	source.start(0);
// // 	play.setAttribute("disabled", "disabled");
// // 	stop.removeAttribute("disabled");
// // 	// playbackControl.removeAttribute("disabled");
// // 	// loopstartControl.removeAttribute("disabled");
// // 	// loopendControl.removeAttribute("disabled");
// // 	// valueControl.removeAttribute("disabled");
// // };

// // stop.onclick = () => {
// // 	source.stop(0);
// // 	play.removeAttribute("disabled");
// // 	stop.setAttribute("disabled", "disabled");
// // 	// playbackControl.setAttribute("disabled", "disabled");
// // 	// loopstartControl.setAttribute("disabled", "disabled");
// // 	// loopendControl.setAttribute("disabled", "disabled");
// // 	// valueControl.setAttribute("disabled", "disabled");
// // };

// // pause.onclick = () => {
// // 	currentTime = source.context.currentTime;
// // 	console.log(currentTime);
// // 	console.log(source);
// // };

// // valueControl.oninput = () => {
// // 	console.log(valueControl.value);
// // };

// // playbackControl.oninput = function () {
// // 	source.playbackRate.value = playbackControl.value;
// // 	playbackValue.innerHTML = playbackControl.value;
// // };

// // loopstartControl.oninput = function () {
// // 	source.loopStart = loopstartControl.value;
// // 	loopstartValue.innerHTML = loopstartControl.value;
// // };

// // loopendControl.oninput = function () {
// // 	source.loopEnd = loopendControl.value;
// // 	loopendValue.innerHTML = loopendControl.value;
// // };
// ////////////////////////////////////////////////////////////////
