import background from "/assets/bg-nuage.png";

export const Loading = () => {

  return (
    
    <div className="w-full h-screen flex justify-center items-center">
       <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${background}')` }}
        />
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50 animate-zoom-in-out"
          
        />
      </div>

      {/* Logo */}
      <div className="absolute md:top-1/2 top-1:3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-20">
       
      </div>

      {/* Enter Button */}
      <div
        className={`absolute bottom-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-[2000]`}
      >
        {/* <Button
          onClick={() => setEnter(true)}
          className="text-2xl"
          variant="default"
        >
          Enter
        </Button> */}
      </div>
    </div>
  );
};