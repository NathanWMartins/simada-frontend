import { Box, Typography, useTheme } from '@mui/material'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SportsOutlinedIcon from '@mui/icons-material/SportsOutlined';
import SportsSoccerOutlinedIcon from '@mui/icons-material/SportsSoccerOutlined';
import GroupsIcon from '@mui/icons-material/Groups';

function BoxFeaturesSuitableMainPage() {
    const theme = useTheme();
    return (
        <>
            {/* Box Features & Suitable*/}
            <Box
                sx={{
                    width: '100vw',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    minHeight: '350px',
                    backgroundColor:
                        theme.palette.background.paper,
                }
                }
            >
                {/* FEATURES */}
                < Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        px: 4,
                        py: 4,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', mb: 1, color: theme.palette.text.primary, textAlign: 'center' }}
                    >
                        Features Available
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ mb: 3, textAlign: 'center', color: theme.palette.text.primary }}
                    >
                        Smart tools designed for modern teams
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex', flexDirection: { xs: 'column', md: 'row' },
                            gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center',
                        }}
                    >
                        {/* CARD 1 */}
                        <Box
                            sx={{
                                backgroundColor: theme.palette.background.default, boxShadow: 3,
                                borderRadius: 2, p: 2, width: 180, display: 'flex', flexDirection: 'column',
                                alignItems: 'center', textAlign: 'center',
                            }}
                        >
                            <Box sx={{ position: 'relative', mb: 1 }}>
                                <Box
                                    sx={{
                                        backgroundColor: '#e9f4e9', borderRadius: '12px 0px 12px 0px',
                                        padding: 0.5, minWidth: 36, minHeight: 36, ml: 3, mt: 1,
                                    }}
                                />
                                <FileDownloadOutlinedIcon
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: 32,
                                        color: theme.palette.mode === 'light' ? '#0C621F' : '#2CAE4D',
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Custom Report<br />for Coaches
                            </Typography>
                            <Typography
                                sx={{ mt: 1, fontWeight: 'light', color: theme.palette.mode === 'light' ? '#717171' : '#EDECEC', fontSize: '0.7rem' }}
                            >
                                Optimized reports to support coaching decisions
                            </Typography>
                        </Box>

                        {/* CARD 2 */}
                        <Box
                            sx={{
                                backgroundColor: theme.palette.background.default,
                                boxShadow: 3,
                                borderRadius: 2,
                                p: 2,
                                width: 180,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}
                        >
                            <Box sx={{ position: 'relative', mb: 1 }}>
                                <Box
                                    sx={{
                                        backgroundColor: '#e9f4e9',
                                        borderRadius: '12px 0px 12px 0px',
                                        padding: 0.5,
                                        minWidth: 36,
                                        minHeight: 36,
                                        ml: 3,
                                        mt: 1,
                                    }}
                                />
                                <SmartToyOutlinedIcon
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: 32,
                                        color: theme.palette.mode === 'light' ? '#0C621F' : '#2CAE4D',
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                AI Based Injury<br />Risk Detection
                            </Typography>
                            <Typography
                                sx={{ mt: 1, fontWeight: 'light', color: theme.palette.mode === 'light' ? '#717171' : '#EDECEC', fontSize: '0.7rem' }}
                            >
                                Detects injury risks using AI analysis
                            </Typography>
                        </Box>

                        {/* CARD 3 */}
                        <Box
                            sx={{
                                backgroundColor: theme.palette.background.default,
                                boxShadow: 3,
                                borderRadius: 2,
                                p: 2,
                                width: 180,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}
                        >
                            <Box sx={{ position: 'relative', mb: 1 }}>
                                <Box
                                    sx={{
                                        backgroundColor: '#e9f4e9',
                                        borderRadius: '12px 0px 12px 0px',
                                        padding: 0.5,
                                        minWidth: 36,
                                        minHeight: 36,
                                        ml: 3,
                                        mt: 1,
                                    }}
                                />
                                <DashboardOutlinedIcon
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: 32,
                                        color: theme.palette.mode === 'light' ? '#0C621F' : '#2CAE4D',
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Personalized<br />Dashboard
                            </Typography>
                            <Typography
                                sx={{ mt: 1, fontWeight: 'light', color: theme.palette.mode === 'light' ? '#717171' : '#EDECEC', fontSize: '0.7rem' }}
                            >
                                Smart views focused on what matters most
                            </Typography>
                        </Box>
                    </Box>
                </Box >

                {/* SUITABLE FOR */}
                < Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        px: 4,
                        py: 4,
                        borderLeft: { md: `1px solid ${theme.palette.divider}` },
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            textAlign: 'center',
                            color: theme.palette.text.primary,
                        }}
                    >
                        Manage your entire athletes in a single system
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ mb: 3, textAlign: 'center', color: theme.palette.text.primary }}
                    >
                        Who is WiKo suitable for?
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 2,
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        {/* CARD 1 */}
                        <Box
                            sx={{
                                backgroundColor: theme.palette.background.default,
                                boxShadow: 3,
                                borderRadius: 2,
                                p: 2,
                                width: 180,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}
                        >
                            <Box sx={{ position: 'relative', mb: 1 }}>
                                <Box
                                    sx={{
                                        backgroundColor: '#e9f4e9',
                                        borderRadius: '12px 0px 12px 0px',
                                        padding: 0.5,
                                        minWidth: 36,
                                        minHeight: 36,
                                        ml: 3,
                                        mt: 1,
                                    }}
                                />
                                <SportsOutlinedIcon
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: 32,
                                        color: theme.palette.mode === 'light' ? '#0C621F' : '#2CAE4D',
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Coaches &<br />Physical Trainers
                            </Typography>
                            <Typography
                                sx={{ mt: 1, fontWeight: 'light', color: theme.palette.mode === 'light' ? '#717171' : '#EDECEC', fontSize: '0.7rem' }}
                            >
                                Access performance insights and training optimization tools
                            </Typography>
                        </Box>

                        {/* CARD 2 */}
                        <Box
                            sx={{
                                backgroundColor: theme.palette.background.default,
                                boxShadow: 3,
                                borderRadius: 2,
                                p: 2,
                                width: 180,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}
                        >
                            <Box sx={{ position: 'relative', mb: 1 }}>
                                <Box
                                    sx={{
                                        backgroundColor: '#e9f4e9',
                                        borderRadius: '12px 0px 12px 0px',
                                        padding: 0.5,
                                        minWidth: 36,
                                        minHeight: 36,
                                        ml: 3,
                                        mt: 1,
                                    }}
                                />
                                <SportsSoccerOutlinedIcon
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: 32,
                                        color: theme.palette.mode === 'light' ? '#0C621F' : '#2CAE4D',
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Athletes for All<br />Sports
                            </Typography>
                            <Typography
                                sx={{ mt: 1, fontWeight: 'light', color: theme.palette.mode === 'light' ? '#717171' : '#EDECEC', fontSize: '0.7rem' }}
                            >
                                Track progress, manage workload, and reduce injury risk
                            </Typography>
                        </Box>

                        {/* CARD 3 */}
                        <Box
                            sx={{
                                backgroundColor: theme.palette.background.default,
                                boxShadow: 3,
                                borderRadius: 2,
                                p: 2,
                                width: 180,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}
                        >
                            <Box sx={{ position: 'relative', mb: 1 }}>
                                <Box
                                    sx={{
                                        backgroundColor: '#e9f4e9',
                                        borderRadius: '12px 0px 12px 0px',
                                        padding: 0.5,
                                        minWidth: 36,
                                        minHeight: 36,
                                        ml: 3,
                                        mt: 1,
                                    }}
                                />
                                <GroupsIcon
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: 32,
                                        color: theme.palette.mode === 'light' ? '#0C621F' : '#2CAE4D',
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Sport Teams and<br />Clubs
                            </Typography>
                            <Typography
                                sx={{ mt: 1, fontWeight: 'light', color: theme.palette.mode === 'light' ? '#717171' : '#EDECEC', fontSize: '0.7rem' }}
                            >
                                Implement centralized data systems to monitor entire squads
                            </Typography>
                        </Box>
                    </Box>
                </Box >
            </Box >
        </>
    )
}

export default BoxFeaturesSuitableMainPage