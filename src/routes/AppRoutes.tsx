import { Route, Routes } from 'react-router-dom'
import MainPage from '../pages/MainPage'
import LoginPageTrainer from '../pages/trainer/LoginPageTrainer'
import RegisterPageTrainer from '../pages/trainer/RegisterPageTrainer'
import HomeTrainer from '../pages/trainer/HomeTrainer'
import LoginPageAthlete from '../pages/athlete/LoginPageAthlete'
import SessionsTrainer from '../pages/trainer/SessionsTrainer'

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />

            {/*Trainer Routes*/}
            <Route path="/trainer-login" element={<LoginPageTrainer />} />
            <Route path="/trainer-register" element={<RegisterPageTrainer />} />
            <Route path="/home-trainer" element={<HomeTrainer />} />
            <Route path="/sessions-trainer" element={<SessionsTrainer />} />

            {/*Athlete Routes*/}
            <Route path="/athlete-login" element={<LoginPageAthlete />} />
        </Routes>
    )
}

export default AppRoutes