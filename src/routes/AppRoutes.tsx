import { Route, Routes } from 'react-router-dom'
import MainPage from '../pages/MainPage'
import LoginPage from '../pages/trainer/LoginPageTrainer'
import RegisterPage from '../pages/trainer/RegisterPageTrainer'
import HomeTrainer from '../pages/trainer/HomeTrainer'

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/homeTrainer" element={<HomeTrainer />} />
        </Routes>
    )
}

export default AppRoutes