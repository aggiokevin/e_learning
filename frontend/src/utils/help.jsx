import toast from 'react-hot-toast';

export const confirmToastAsync = (message,type) => {
  return new Promise((resolve) => {
    toast.custom(
      (t) => (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)', // fond semi-transparent
          }}
        >
          <div
        className="bg-white rounded-lg shadow-xl p-8 w-96 max-w-[90%] text-center"
        style={{
          // 50% = milieu vertical, +10% = un peu plus bas
          position: 'absolute',
          top: '300px',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
            <p className="text-lg font-semibold mb-6">{message}</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  resolve(true);
                  toast.dismiss(t.id);
                }}
                className={type === "confirm" ? "px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" : type === "delete" ? "px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" : "px-6 py-2 bg-yellow-400 text-white rounded-lg hover:bg-red-500"}
              >
                Confirmer
              </button>

              <button
                onClick={() => {
                  resolve(false);
                  toast.dismiss(t.id);
                }}
                className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity, // ne disparaît pas tout seul
        position: 'top-center', // position par défaut, mais le style fixed fait le vrai centrage
      }
    );
  });
};
