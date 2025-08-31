import { Route, Routes } from 'react-router-dom'
import MainPage from '../pages/MainPage'
import LoginPageTrainer from '../pages/trainer/auth/LoginPageTrainer'
import RegisterPageTrainer from '../pages/trainer/auth/RegisterPageTrainer'
import HomeTrainer from '../pages/trainer/HomeTrainer'
import LoginPageAthlete from '../pages/athlete/LoginPageAthlete'
import SessionsTrainer from '../pages/trainer/session/SessionsTrainer'
import MyAthletes from '../pages/trainer/MyAthletes'
import NewSession from '../pages/trainer/session/NewSession'

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />

            {/*Trainer Routes*/}
            <Route path="/trainer-login" element={<LoginPageTrainer />} />
            <Route path="/trainer-register" element={<RegisterPageTrainer />} />
            <Route path="/trainer-home" element={<HomeTrainer />} />
            <Route path="/trainer-sessions" element={<SessionsTrainer />} />
            <Route path="/trainer-athletes" element={<MyAthletes />} />
            <Route path="/trainer-new-session" element={<NewSession />} />

            {/*Athlete Routes*/}
            <Route path="/athlete-login" element={<LoginPageAthlete />} />
            
        </Routes>
    )
}

export default AppRoutes