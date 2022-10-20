import './App.css';
import React,{useContext} from "react";
import Maps from './components/Maps';
import SpinnerLoader from './components/SpinnerLoader';
import MapContext from './context/MapContext'

function App() {

  const {isLoading} = useContext(MapContext)


  return (
    <div>
      {isLoading ? (
        <SpinnerLoader />
      ) : (
        <div className="mapperContainer">
          <Maps />
        </div>
      )}
    </div>
  );

}

export default App;
