import { Box, useTheme } from '@mui/material';
import LogoLight from '../../assets/LogoWiKoLight.png';
import LogoDark from '../../assets/LogoWiKoDark.png';

const Logo = () => {
    const theme = useTheme();
    const logo = theme.palette.mode === 'dark' ? LogoDark : LogoLight;

    return <Box component="img" src={logo} alt="WIKO Logo" sx={{ height: 30}} />;
};

export default Logo;
