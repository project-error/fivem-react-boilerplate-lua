import React, {useState} from 'react';
import './App.css'
import {useNuiEvent} from "../hooks/useNuiEvent";
import {debugData} from "../utils/debugData";
import {fetchNui} from "../utils/fetchNui";
import {useExitListener} from "../hooks/useExitListener";

// This will set the NUI to visible if we are
// developing in browser
debugData([
  {
    action: 'setVisible',
    data: true,
  }
])

interface ReturnClientDataCompProps {
  data: any
}

const ReturnClientDataComp: React.FC<ReturnClientDataCompProps> = ({data}) => (
  <>
    <h5>Returned Data:</h5>
    <pre>
      <code>
        {JSON.stringify(data, null)}
      </code>
    </pre>
  </>
)

interface ReturnData {
  x: number;
  y: number;
  z: number;
}

const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [clientData, setClientData] = useState<ReturnData | null>(null)

  useNuiEvent<boolean>('setVisible', (data) => {
    // This is our handler for the setVisible action.
    console.log(data)
    setIsVisible(data)
  })

  useExitListener(setIsVisible)

  const handleGetClientData = () => {
    fetchNui<ReturnData>('getClientData').then(retData => {
      console.log('Got return data from client scripts:')
      console.dir(retData)
      setClientData(retData)
    }).catch(e => {
      console.error('Setting mock data due to error', e)
      setClientData({ x: 500, y: 300, z: 200})
    })
  }

  return (
    <div className="nui-wrapper">
      <div className='popup-thing' style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
        <div>
          <h1>This is the NUI Popup!</h1>
          <p>Exit with the escape key</p>
          <button onClick={handleGetClientData}>Get Client Data</button>
          {clientData && <ReturnClientDataComp data={clientData} />}
        </div>
      </div>
    </div>
  );
}

export default App;
