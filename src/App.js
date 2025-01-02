import './App.css';
import { useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./components/pages/StartPage/StartPage";
import MainPage from "./components/pages/MainPage/MainPage";
import SelfReminder from "./components/pages/SelfReminder/SelfReminder";
import FriendReminder from "./components/pages/FriendReminder/FriendReminder";
import Confirm from "./components/pages/Confirm/Confirm";
import { ReminderProvider } from "./components/components/ReminderContext/ReminderContext";
import InviteFriend from "./components/pages/InivteFriend/InviteFriend";

const tg = window.Telegram.WebApp;

function App() {
    const { onToggleButton, tg } = useTelegram();

    useEffect(() => {
        tg.ready();
    }, []);

    return (
        <div className="App">

                <ReminderProvider>
                    <Routes>
                        <Route index element={<StartPage />} />
                        <Route path={'main_page'} element={<MainPage />} />
                        <Route path={'self_reminder'} element={<SelfReminder />} />
                        <Route path={'friend_reminder'} element={<FriendReminder />} />
                        <Route path={'confirm'} element={<Confirm />} />
                        <Route path={'invite_friend'} element={<InviteFriend />} />
                    </Routes>
                </ReminderProvider>

        </div>
    );
}

export default App;
