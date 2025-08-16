import { Route, Routes } from 'react-router-dom'
import MainPage from '../pages/MainPage'
import LoginPageTrainer from '../pages/trainer/LoginPageTrainer'
import RegisterPageTrainer from '../pages/trainer/RegisterPageTrainer'
import HomeTrainer from '../pages/trainer/HomeTrainer'
import LoginPageAthlete from '../pages/athlete/LoginPageAthlete'

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/trainer-login" element={<LoginPageTrainer />} />
            <Route path="/trainer-register" element={<RegisterPageTrainer />} />
            <Route path="/homeTrainer" element={<HomeTrainer />} />

            <Route path="/athlete-login" element={<LoginPageAthlete />} />
        </Routes>
    )
}

export default AppRoutes