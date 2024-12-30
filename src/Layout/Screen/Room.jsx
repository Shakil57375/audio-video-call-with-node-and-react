
import React, { useCallback, useEffect, useState } from "react";
import Container from "../Container/Container";
import { useSocket } from "../../Context/SocketProvider";
import { PhoneOutgoing } from "lucide-react";
import peer from "../../Service/peer";

const Room = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [incomingStream, setIncomingStream] = useState();

  // Handle when a user joins the room
  const handleUserJoined = useCallback((data) => {
    const { email, id } = data;
    console.log(`User with email ${email} joined the room. Socket ID: ${id}`);
    setRemoteSocketId(id);
  }, []);

  // Handle making a call to the remote user
  const handleCallUser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setMyStream(stream);

      // Add tracks to the peer connection
      peer.addTracks(stream);

      // Create an offer and send it to the remote user
      const offer = await peer.getOffer();
      socket.emit("user:call", { to: remoteSocketId, offer });
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  }, [remoteSocketId, socket]);

  // Handle incoming call from another user
  const handleInCommingCall = useCallback(
    async ({ from, offer }) => {
      try {
        console.log(`Incoming call from: ${from}`, offer);
        setRemoteSocketId(from);

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setMyStream(stream);

        // Add tracks to the peer connection
        peer.addTracks(stream);

        // Set remote offer and create an answer
        const answer = await peer.getAnswer(offer);
        socket.emit("call:accepted", { to: from, ans: answer });
      } catch (err) {
        console.error("Error handling incoming call:", err);
      }
    },
    [socket]
  );

  // Handle call acceptance from the remote user
  const handleCallAccepted = useCallback(({ ans, from }) => {
    console.log(`Call accepted by ${from}`);
    peer.setLocalDescription(ans); // Set remote answer description
  }, []);

  // Handle incoming streams
  useEffect(() => {
    peer.onTrack((stream) => {
      console.log("Incoming stream received:", stream);
      setIncomingStream(stream);

      // Play the incoming audio
      const audio = new Audio();
      audio.srcObject = stream;
      audio.play();
    });
  }, []);

  // Socket event listeners
  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleInCommingCall);
    socket.on("call:accepted", handleCallAccepted);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleInCommingCall);
      socket.off("call:accepted", handleCallAccepted);
    };
  }, [socket, handleUserJoined, handleInCommingCall, handleCallAccepted]);

  return (
    <Container>
      <div className="flex flex-col justify-center h-screen">
        <h1 className="text-3xl font-bold text-center">Room Page</h1>
        <h3 className="text-center mt-2">
          <h1 className="text-red-500 font-semibold pb-4">My Point of View</h1>
          {remoteSocketId ? "Connected" : "No one in the room"}
        </h3>
        <div className="flex items-center gap-5 mx-auto mt-5">
          {remoteSocketId && (
            <button
              onClick={handleCallUser}
              className="text-center bg-green-600 hover:bg-green-700 p-2 rounded-full"
            >
              <PhoneOutgoing size={20} className="text-white" />
            </button>
          )}

          {myStream && (
            <div>
              <h2 className="text-lg font-bold text-center">Your Audio</h2>
              <audio controls autoPlay muted srcObject={myStream} />
            </div>
          )}

          {incomingStream && (
            <div>
              <h2 className="text-lg font-bold text-center">Incoming Audio</h2>
              <audio controls autoPlay srcObject={incomingStream} />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Room;
