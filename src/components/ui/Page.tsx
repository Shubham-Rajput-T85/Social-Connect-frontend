import { Box } from '@mui/material'
import React from 'react'
import Sidebar from './Sidebar'

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "1fr 4fr",
                gap: 2,
                padding: 2,
                height: "100%",
            }}
        >
            <Sidebar />
            {children}
        </Box>
    )
}

export default Page