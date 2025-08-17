import React from 'react';
import { Fab } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface BackFabProps {
    to?: string;
}

const BackFab: React.FC<BackFabProps> = ({ to }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <Fab
            size="small"
            onClick={handleClick}
            sx={{
                position: 'fixed',
                top: 16,
                left: 16,
                backgroundColor: '#2CAE4D',
                color: '#fff',
                boxShadow: 4,
                '&:hover': {
                    backgroundColor: '#249B45'
                }
            }}
        >
            <ArrowBackIcon />
        </Fab>
    );
};

export default BackFab;
