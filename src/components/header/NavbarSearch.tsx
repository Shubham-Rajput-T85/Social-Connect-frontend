import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Modal,
    Typography,
    Paper,
    Backdrop,
} from "@mui/material";
import { useSelector } from "react-redux";
import Loader from "../ui/Loader";

import UserProfileModal from "./UserProfileModal"; 

export interface NavbarSearchProps {
    onClose: () => void; // Required for desktop close action
    isMobile?: boolean; // Optional - controls mobile layout
    openModal?: boolean; // Optional - determines if modal is open
    onCloseModal?: () => void; // Optional - handles closing modal
}

const NavbarSearch: React.FC<NavbarSearchProps> = ({
    onClose,
    isMobile = false,
    openModal = false,
    onCloseModal,
}) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const user = useSelector((state: any) => state.auth.user);

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
    /** */

    /**
     * Fetch users from backend (merged functionality)
     */
    const handleSearch = async (searchText: string) => {
        if (!searchText.trim()) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:8080/user/getUsers?query=${searchText}&userId=${user._id}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!response.ok) throw new Error("Failed to fetch users");

            const data = await response.json();
            setResults(data.users || []);
            setShowDropdown(true);
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle search input with debounce
     */
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            handleSearch(value);
        }, 300);
    };

    /**
     * Close search dropdown on outside click
     */
    const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            resetSearch();
        }
    };

    const resetSearch = () => {
        setQuery("");
        setResults([]);
        setShowDropdown(false);
    };

    useEffect(() => {
        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    /**
     * Render search results
     */
    const renderSearchResults = () => (
        <List>
            {results.map((user) => (
                <ListItem
                    key={user._id}
                    disablePadding
                    onClick={() => {
                        // console.log("Navigate to user profile:", user._id);
                        // resetSearch();
                        // if (isMobile && onCloseModal) onCloseModal();
                        // else onClose();
                        setSelectedUser(user);       // set clicked user
                        setProfileModalOpen(true); 
                        /** */
                    }}
                    sx={{
                        cursor: "pointer",
                        p: 1,
                        borderRadius: "20px",
                        "&:hover": {
                            backgroundColor: "#f0f0f0",
                        },
                        borderBottom: "1px solid lightgray",
                    }}
                >
                    <ListItemAvatar>
                        <Avatar
                            src={
                                user.profileUrl ? `http://localhost:8080${user.profileUrl}` : undefined
                            }
                            alt={user.username || "User"}
                        >
                            {(user.username?.[0] || "U").toUpperCase()}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={user.name || user.username || "Unknown User"}
                        secondary={user.email || ""}
                    />
                </ListItem>
            ))}

            {!loading && query.trim() && results.length === 0 && (
                <Typography variant="body2" sx={{ textAlign: "center", p: 2 }}>
                    No users found
                </Typography>
            )}
        </List>
    );

    /**
     * Desktop layout
     */
    const desktopSearch = (
        <>
            {/* Background blur when dropdown is open */}
            {showDropdown && (
                <Backdrop
                    open
                    sx={{
                        zIndex: 9,
                        backgroundColor: "rgba(0,0,0,0.3)",
                        backdropFilter: "blur(4px)",
                    }}
                />
            )}

            <Box
                ref={containerRef}
                sx={{
                    width: 360,
                    position: "relative",
                    zIndex: 10,
                }}
            >
                <TextField placeholder="Search users..."
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={query}
                    onChange={handleSearchChange}
                    onFocus={() => query.trim() && setShowDropdown(true)}
                    sx={{
                        backgroundColor: "white",
                        borderRadius: 2,
                        boxShadow: showDropdown ? "0 4px 10px rgba(0,0,0,0.1)" : "none",
                    }}
                />

                {/* Dropdown */}
                {showDropdown && (
                    <Paper
                        sx={{
                            position: "absolute",
                            top: "110%",
                            left: 0,
                            right: 0,
                            mt: 1,
                            maxHeight: 300,
                            overflowY: "auto",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            borderRadius: "20px",
                        }}
                    >
                        {loading ? (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: "rgba(255, 255, 255, 0.6)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    zIndex: 10,
                                }}
                            >
                                <Loader />
                            </Box>
                        ) : (
                            renderSearchResults()
                        )}
                    </Paper>
                )}
            </Box>
        </>
    );

    /**
     * Mobile modal layout
     */
    const mobileSearch = (
        <Modal
            open={openModal || false}
            onClose={() => {
                resetSearch();
                if (onCloseModal) onCloseModal();
            }}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <Paper
                sx={{
                    width: "90%",
                    maxWidth: 400,
                    p: 2,
                    outline: "none",
                    borderRadius: 2,
                }}
            >
                <TextField
                    placeholder="Search users..."
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={query}
                    onChange={handleSearchChange}
                />

                <Box sx={{ mt: 2, maxHeight: 400, overflowY: "auto" }}>
                    {loading ? (
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: "rgba(255, 255, 255, 0.6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 10,
                            }}
                        >
                            <Loader />
                        </Box>

                    ) : (
                        renderSearchResults()
                    )}
                </Box>
            </Paper>
        </Modal>
    );

    return (
        <>
            {isMobile ? mobileSearch : desktopSearch}
    
            {selectedUser && (
                <UserProfileModal
                    open={profileModalOpen}
                    onClose={() => setProfileModalOpen(false)}
                    userData={selectedUser}
                    currentUserId={user?._id}
                />
            )}
        </>
    );
};

export default NavbarSearch;
