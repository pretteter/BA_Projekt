// var net = require('net')
// var rtsp = require('rtsp-stream')

// Stream = require('node-rtsp-stream')
// stream = new Stream({
//   name: 'name',
//   streamUrl: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4',
//   wsPort: 9999,
//   ffmpegOptions: { // options ffmpeg flags
//     '-stats': '', // an option with no neccessary value uses a blank string
//     '-r': 30 // options with required values specify the value after the key
//   }
// })

// var server = net.createServer(function (socket) {
//   var decoder = new rtsp.Decoder()
//   var encoder = new rtsp.Encoder()

//   decoder.on('request', function (req) {
//     console.log(req.method, req.uri)

//     // output the request body
//     req.pipe(process.stdout)

//     req.on('end', function () {
//       // prepare a new response to the client
//       var res = encoder.response()

//       res.setHeader('CSeq', req.headers['cseq'])
//       res.end('Hello World!')
//     })
//   })

//   // pipe the data from the client into the decoder
//   socket.pipe(decoder)

//   // ...and pipe the response back to the client from the encoder
//   encoder.pipe(socket)
// })

// server.listen(5000)

// navigator.getUserMedia =
//   navigator.getUserMedia ||
//   navigator.mozGetUserMedia ||
//   navigator.webkitGetUserMedia;
// window.RTCPeerConnection =
//   window.RTCPeerConnection ||
//   window.mozRTCPeerConnection ||
//   window.webkitRTCPeerConnection;
// window.RTCIceCandidate =
//   window.RTCIceCandidate ||
//   window.mozRTCIceCandidate ||
//   window.webkitRTCIceCandidate;
// window.RTCSessionDescription =
//   window.RTCSessionDescription ||
//   window.mozRTCSessionDescription ||
//   window.webkitRTCSessionDescription;

var localVideo;
var remoteVideo;
var peerConnection;
var peerConnectionConfig = {
  iceServers: [
    { url: "stun:stun.services.mozilla.com" },
    { url: "stun:stun.l.google.com:19302" },
  ],
};

function pageReady() {
  localVideo = document.getElementById("localVideo");
  remoteVideo = document.getElementById("remoteVideo");

  serverConnection = new WebSocket("ws://127.0.0.1:3434");
  serverConnection.onmessage = gotMessageFromServer;

  var constraints = {
    video: true,
    audio: true,
  };

  if (navigator.getUserMedia) {
    navigator.getUserMedia(constraints, getUserMediaSuccess, getUserMediaError);
  } else {
    alert("Your browser does not support getUserMedia API");
  }
}

function getUserMediaSuccess(stream) {
  localStream = stream;
  localVideo.src = window.URL.createObjectURL(stream);
}

function getUserMediaError(error) {
  console.log(error);
}

function start(isCaller) {
  peerConnection = new RTCPeerConnection(peerConnectionConfig);
  peerConnection.onicecandidate = gotIceCandidate;
  peerConnection.onaddstream = gotRemoteStream;
  peerConnection.addStream(localStream);

  if (isCaller) {
    peerConnection.createOffer(gotDescription, createOfferError);
  }
}

function gotDescription(description) {
  console.log("got description");
  peerConnection.setLocalDescription(
    description,
    function () {
      serverConnection.send(JSON.stringify({ sdp: description }));
    },
    function () {
      console.log("set description error");
    }
  );
}

function gotIceCandidate(event) {
  if (event.candidate != null) {
    serverConnection.send(JSON.stringify({ ice: event.candidate }));
  }
}

function gotRemoteStream(event) {
  console.log("got remote stream");
  remoteVideo.src = window.URL.createObjectURL(event.stream);
}

function createOfferError(error) {
  console.log(error);
}

function gotMessageFromServer(message) {
  if (!peerConnection) start(false);

  var signal = JSON.parse(message.data);
  if (signal.sdp) {
    peerConnection.setRemoteDescription(
      new RTCSessionDescription(signal.sdp),
      function () {
        if (signal.sdp.type == "offer") {
          peerConnection.createAnswer(gotDescription, createAnswerError);
        }
      }
    );
  } else if (signal.ice) {
    peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
  }
}
