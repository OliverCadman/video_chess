import React, {useState, useRef, useEffect} from 'react';
import Peer from 'simple-peer'
const socket = require("../connections/socket").socket

const VideoChat = (props) => {
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const callerVideo = useRef();
    const receiverVideo = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true}).then(stream => {
            setStream(stream)
            if (callerVideo.current) {
                callerVideo.current.srcObject = stream;
            }
        })

         socket.on("video connected", (data) => {
           console.log("video data", data)
           setReceivingCall(true);
           setCaller(data.from);
           setCallerSignal(data.signal);
         });
    }, [callerVideo, receiverVideo])

    function initPeer(id) {
        setIsCalling(true);
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })

    peer.on("signal", data => {
        console.log("signal data", data)
        socket.emit("callUser", {userToCall: id, signalData: data, from: props.mySocketId})
    })

    peer.on("stream", stream => {
        if(receiverVideo.current) {
            receiverVideo.current.srcObject = stream;
        }
    })

    socket.on("callAccepted", signal => {
        setCallAccepted(true);
        peer.signal(signal);
    })
    }

    function acceptCall() {
        setCallAccepted(true);
        setIsCalling(false);

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })

        peer.on("signal", data => {
            socket.emit("acceptCall", {signal: data, to: caller})
        })

        peer.on("stream", stream => {
            receiverVideo.current.srcObject = stream;
        })

        peer.signal(callerSignal);
    }

    let userVideo;

    if(stream) {
        if (callAccepted) {
            userVideo = (
                <>
                    <video
                        playsInline
                        muted
                        ref={receiverVideo}
                        autoPlay
                        style={{ width: "100%" }}
                    />
                </>
            );
        } else {
            <>
              <video
                playsInline
                muted
                ref={callerVideo}
                autoPlay
                style={{ width: "100%" }}
              />
              <video
                playsInline
                muted
                ref={receiverVideo}
                autoPlay
                style={{ width: "100%" }}
              />
            </>;
        }
    }

    let mainView;

    if(callAccepted) {
        mainView = (
            <>
            <video playsInline muted ref={receiverVideo} autoPlay style={{width: "100%" }}/>
            </>
        )
    } else if (receivingCall) {
        mainView = (
          <div>
            <h3>{props.opponentUserName} is calling you!</h3>
            <button
            className="btn dark-button"
            onClick={acceptCall}
            >Accept</button>
          </div>
        );
    } else if (isCalling) {
        mainView = (
            <div>
                <h3 style={{fontFamily: "Work Sans, sans-serif", fontSize: "1.5rem", marginTop: "2rem"}}>Calling {props.opponentUserName}</h3>
            </div>
        )
    } else {
        mainView = (
          <>
              <button
                className="btn dark-button"
                onClick={() => {
                  if (props.opponentDidJoinTheGame) {
                      initPeer(props.opponentSocketId)
                  } else {
                      initPeer(props.mySocketId);
                  }
                }}
                style={{marginTop: "2rem"}}
              >
                Call {props.opponentUserName}
              </button>
          </>
        );
    }

   
  return (
    <div
      style={{
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        padding: "0 .5rem",
        boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      {userVideo}
      <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        {mainView}
      </div>
    </div>
  );
}

export default VideoChat