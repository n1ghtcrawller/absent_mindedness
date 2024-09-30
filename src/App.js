import './App.css';
import {useEffect} from "react";
import {useTelegram} from "./hooks/useTelegram";
import {Route, Routes} from "react-router-dom";
import StartPage from "./components/pages/StartPage/StartPage";

const tg = window.Telegram.WebApp;

function App() {
  const {onToggleButton, tg} = useTelegram();

  useEffect(() => {
      tg.ready()
  }, []);
  return (
    <div className="App">
      <Routes>
          <Route index element={<StartPage/>} />

      </Routes>
    </div>
  );
}


export default App;
