import { useForm } from "react-hook-form";
import { useSocket } from "../../Context/SocketProvider";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LobbyScreen = () => {
  const socket = useSocket();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    socket.emit("room:join", {
      email: data.email,
      roomID: data.roomID,
    });
    reset();
  };

  const handleJoinRoom = useCallback((data) => {
    const { email, roomID } = data;
    // console.log(email, roomID);
    navigate(`/room/${roomID}`);
  }, []);

  useEffect(() => {
    if (!socket) {
      console.error("Socket not initialized in useEffect");
      return;
    }

    socket.on("room:join", handleJoinRoom);

    // Cleanup the listener to avoid memory leaks
    return () => socket.off("room:join", handleJoinRoom);
  }, [socket]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center pb-5">Lobby Screen</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between w-full">
          <div>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text text-lg font-semibold">
                  Email Address
                </span>
              </div>
              <input
                type="email"
                placeholder="test@gmail.com"
                className="input input-bordered w-full text-base"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </label>
          </div>

          <div>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text text-lg font-semibold">
                  Room ID
                </span>
              </div>
              <input
                type="number"
                placeholder="Enter Room ID"
                className="input input-bordered w-full text-base"
                {...register("roomID", {
                  required: "Room ID is required",
                })}
              />
              {errors.roomID && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.roomID.message}
                </p>
              )}
            </label>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary w-full max-w-xs mt-5 text-white"
          >
            Join Lobby
          </button>
        </div>
      </form>
    </div>
  );
};

export default LobbyScreen;
