import { Route, Routes } from 'react-router-dom'
import MainPage from '../pages/MainPage'
import LoginPageTrainer from '../pages/trainer/LoginPageTrainer'
import RegisterPageTrainer from '../pages/trainer/RegisterPageTrainer'
import HomeTrainer from '../pages/trainer/HomeTrainer'
import LoginPageAthlete from '../pages/athlete/LoginPageAthlete'
import SessionsTrainer from '../pages/trainer/SessionsTrainer'
import MyAthletes from '../pages/trainer/MyAthletes'

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

            {/*Athlete Routes*/}
            <Route path="/athlete-login" element={<LoginPageAthlete />} />
            
        </Routes>
    )
}

export default AppRoutes