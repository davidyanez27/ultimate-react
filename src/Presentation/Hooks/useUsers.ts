import { useState, useEffect } from 'react';
import { useAuthStore } from './Store/useAuthStore';

export const useUsers = (page: number = 1, limit: number = 10) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getAllUsers } = useAuthStore();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllUsers(page, limit);
            if (data) {
                setUsers(data.users || data);
            }
        } catch (err) {
            setError(err as string);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, limit]);

    return { users, loading, error, refetch: fetchUsers };
};

export const useUser = (uuid: string) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getUserById } = useAuthStore();

    const fetchUser = async () => {
        if (!uuid) return;
        
        try {
            setLoading(true);
            setError(null);
            const data = await getUserById(uuid);
            if (data) {
                setUser(data.user || data);
            }
        } catch (err) {
            setError(err as string);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [uuid]);

    return { user, loading, error, refetch: fetchUser };
};