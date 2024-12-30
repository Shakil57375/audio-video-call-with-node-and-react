import LobbyScreen from "../../Layout/Screen/LobbyScreen";

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className=" w-2/6 gap-5">
        <div className="bg-gray-300  p-5">
          <LobbyScreen />
        </div>
      </div>
    </div>
  );
};

export default Home;
