import './App.css';
import {useEffect} from "react";
import {useTelegram} from "./hooks/useTelegram";
import {Route, Routes} from "react-router-dom";
import StartPage from "./components/pages/StartPage/StartPage";
import MainPage from "./components/pages/MainPage/MainPage";
import SelfReminder from "./components/pages/SelfReminder/SelfReminder";

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
          <Route path={'main_page'} element={<MainPage/>} />
          <Route path={'self_reminder'} element={<SelfReminder/>} />
      </Routes>
    </div>
  );
}


export default App;
