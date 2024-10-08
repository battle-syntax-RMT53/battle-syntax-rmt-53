import { useParams } from "react-router-dom";

const BattlePage = () => {
  const { roomId } = useParams();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Battle Page</h1>
      <h2 className="text-xl">Welcome to Room: {roomId}</h2>
      {/* Tambahkan logika permainan di sini */}
    </div>
  );
};

export default BattlePage;
