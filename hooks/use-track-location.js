import { useState } from "react";

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");

  const handleTraclLocation = () => {
    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocation is not supported by your browser");
    } else {
      // setLocationErrorMsg("Locating..");
      navigator.geolocation.getCurrentPosition();
    }
  };
};

export default useTrackLocation;
