import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/";

export const useVoting = (projectId, initialVotes = { upvotes: [], downvotes: [] }, user) => {
    const [votes, setVotes] = useState(initialVotes);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialVotes) {
            setVotes(initialVotes);
        }
    }, [initialVotes]);

    const handleVote = async (voteType) => {
        const isDummy = !projectId || String(projectId).startsWith('dummy-');
        const voterId = user?._id || 'guest_voter';

        // Local optimistic vote for dummy showcase templates
        if (isDummy) {
            setVotes((prev) => {
                const up = Array.isArray(prev?.upvotes) ? [...prev.upvotes] : [];
                const down = Array.isArray(prev?.downvotes) ? [...prev.downvotes] : [];

                if (voteType === 'up') {
                    if (up.includes(voterId)) {
                        return { upvotes: up.filter(id => id !== voterId), downvotes: down };
                    } else {
                        return { upvotes: [...up, voterId], downvotes: down.filter(id => id !== voterId) };
                    }
                } else {
                    if (down.includes(voterId)) {
                        return { upvotes: up, downvotes: down.filter(id => id !== voterId) };
                    } else {
                        return { upvotes: up.filter(id => id !== voterId), downvotes: [...down, voterId] };
                    }
                }
            });
            return;
        }

        if (!user) {
            Swal.fire({
                icon: 'info',
                title: 'Sign In Required',
                text: 'Please sign in with Google to vote on community projects.',
                background: '#18181b',
                color: '#fff',
                confirmButtonColor: '#6366F1'
            });
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(`${BACKEND_URL}project/vote`, {
                projectId,
                voteType,
                userId: user?._id
            });

            setVotes(response.data.votes);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Vote failed');
        } finally {
            setLoading(false);
        }
    };

    return { votes, loading, error, handleVote };
};