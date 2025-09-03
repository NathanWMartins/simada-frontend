import { Route, Routes } from 'react-router-dom'
import MainPage from '../pages/MainPage'
import LoginPageTrainer from '../pages/trainer/auth/LoginPageTrainer'
import RegisterPageTrainer from '../pages/trainer/auth/RegisterPageTrainer'
import HomeTrainer from '../pages/trainer/HomeTrainer'
import LoginPageAthlete from '../pages/athlete/auth/LoginPageAthlete'
import SessionsTrainer from '../pages/trainer/session/SessionsTrainer'
import MyAthletes from '../pages/trainer/athlete/MyAthletes'
import NewSession from '../pages/trainer/session/NewSession'
import EditAthlete from '../pages/trainer/athlete/EditAthlete'
import InviteSignup from '../pages/athlete/auth/InviteSignup'

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />

            {/*Trainer Routes*/}
            <Route path="/trainer-login" element={<LoginPageTrainer />} />
            <Route path="/trainer-register" element={<RegisterPageTrainer />} />
            <Route path="/trainer-home" element={<HomeTrainer />} />
            <Route path="/trainer-sessions" element={<SessionsTrainer />} />
            <Route path="/trainer-new-session" element={<NewSession />} />
            <Route path="/trainer-athletes" element={<MyAthletes />} />
            <Route path="/athletes/:id/edit" element={<EditAthlete />} />

            {/*Athlete Routes*/}
            <Route path="/athlete-login" element={<LoginPageAthlete />} />
            <Route path="/signup" element={<InviteSignup />} />

        </Routes>
    )
}

export default AppRoutes
