import { useDispatch } from 'react-redux';
import { useAppSelector } from '..';
import { InventoryBackend } from '../../Api/Index';
import {
  setLoading,
  setError,
  setUsers,
  addUser,
  updateUser,
  setSelectedUser,
  setPagination,
  setFilters,
  clearFilters,
  clearUsers,
  setUser,
} from '../../Store';
import type { AxiosError } from 'axios';
import type { IUpdateUserRequest } from '@inventory/shared-types';

export const useUsersStore = () => {

    const { users, selectedUser, loading, errorMessage, pagination, filters } = useAppSelector( state => state.users );
    const dispatch = useDispatch();



    const startFetchUsers = async(page: number = 1, limit: number = 10) => {
        dispatch(setLoading(true));

        try {
            const { data } = await InventoryBackend.get(`/users/findAll?page=${page}&limit=${limit}`);
            
            dispatch(setUsers(data.users || data));
            if (data) {
                dispatch(setPagination({
                    page: data.page || page,
                    limit: data.limit || limit,
                    total: data.total || 0,
                    totalPages: data.totalPages || 0,
                }));
            }
            
        } catch (error: unknown) {
            const err = error as AxiosError<any>;
            dispatch(setError(err.response?.data.error || 'Error fetching users'));
            dispatch(setLoading(false));

        }
        dispatch(setLoading(false));
    };

    const startFetchUserById = async(uuid: string) => {
        dispatch(setLoading(true));


        try {
            const { data } = await InventoryBackend.get(`/users/find/${uuid}`);           
            dispatch(setSelectedUser(data.user || data));
            
        } catch (error: unknown) {
            const err = error as AxiosError<any>;
            dispatch(setError(err.response?.data.error || 'Error fetching user'));
        }
    };

    const startCreateUser = async(userData: any) => {
        dispatch(setLoading(true));

        try {
            const { data } = await InventoryBackend.post('/users', userData);            
            dispatch(addUser(data.user || data));
            
        } catch (error: unknown) {
            const err = error as AxiosError<any>;
            dispatch(setError(err.response?.data.error || 'Error creating user'));
        }
    };

    const startUpdateUserById = async(uuid:string, UserDto: IUpdateUserRequest) => {

        const { username, email, firstName, lastName, roleId } = UserDto;
        dispatch(setLoading(true));
        console.log(uuid, UserDto);
        try {
            const { data } = await InventoryBackend.post(`/users/update/${uuid}`, {uuid, username, email, firstName, lastName, roleId });
            dispatch(setUser(data.user || data));
            console.log(data)
            // dispatch(updateUser({ id:uuid, updates: UserDto }));
            
        } catch (error: unknown) {
            const err = error as AxiosError<any>;
            dispatch(setError(err.response?.data.error || 'Error updating user'));
        }
        dispatch(setLoading(false));
    };

    const updateUsersFilters = (newFilters: any) => {
        dispatch(setFilters(newFilters));
    };

    const clearUsersFilters = () => {
        dispatch(clearFilters());
    };

    const clearUsersData = () => {
        dispatch(clearUsers());
    };

    const selectUser = (user: any) => {
        dispatch(setSelectedUser(user));
    };

    const clearError = () => {
        dispatch(setError(null));
    };

    return {
        //* Properties
        users,
        selectedUser,
        loading,
        errorMessage,
        pagination,
        filters,

        //* Methods
        startFetchUsers,
        startFetchUserById,
        startCreateUser,
        startUpdateUserById,
        // startDeleteUser,
        updateUsersFilters,
        clearUsersFilters,
        clearUsersData,
        selectUser,
        clearError,
    }

};