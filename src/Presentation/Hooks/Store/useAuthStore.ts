import { useDispatch } from 'react-redux';
import { clearErrorMessage, onChecking, onLogin, onLogout } from '../../Store';
import { InventoryBackend } from '../../Api/Index';
import { useAppSelector } from '..';
import type { AxiosError } from 'axios';
import type { SignInFormDataInterface, SignUpFormDataInterface } from '@inventory/shared-types';


export const useAuthStore = () => {

    const { status, user, errorMessage } = useAppSelector(state => state.auth);
    const dispatch = useDispatch();

    const startLogin = async ({ email, password }: SignInFormDataInterface) => {
        dispatch(onChecking());
        try {
            const { data } = await InventoryBackend.post('/auth/login', { email, password });

            dispatch(onLogin({ ...data.user }));
        } catch (error: unknown) {
            const err = error as AxiosError<any>
            dispatch(onLogout(err.response?.data.error));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 3000);
        }
    }
    const startRegister = async ({ username, firstName, lastName, email, password }: SignUpFormDataInterface) => {
        dispatch(onChecking());
        try {
            const { data } = await InventoryBackend.post('/auth/register', { username, firstName, lastName, email, password, role: 1 });
            dispatch(onLogin({ ...data.user }));

        } catch (error: unknown) {
            const err = error as AxiosError<any>
            dispatch(onLogout(err.response?.data.error));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 3000);
        }
    }

    const OAuth2Login = async () => {
        dispatch(onChecking());
        try {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");
            console.log(`Code ${code}`)
            const { data } = await InventoryBackend.get('/auth/google');
            dispatch(onLogin({ ...data.user }));

        } catch (error) {
            dispatch(onLogout('Invalid Credentials'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    }

    const oauthLogin = async ({ email }: SignInFormDataInterface) => {
        dispatch(onChecking());
        try {
            const { data } = await InventoryBackend.post('/auth/oauth', { email });
            dispatch(onLogin({ ...data.user }));

        } catch (error) {
            dispatch(onLogout('Invalid Credentials'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    }


    const checkAuthToken = async () => {
        try {
            const { data } = await InventoryBackend.get('auth/renew',);
            if (!data.user) return dispatch(onLogout());
            dispatch(onLogin({ ...data.user }));

        } catch (error) {
            dispatch(onLogout());
        }
    }

    const getAuthUrl = () => {
        window.location.href = 'http://localhost:3000/api/auth/google';
    };

    const startLogout = async () => {
        try {
            await InventoryBackend.post('/auth/logout');
        } catch (error) {
            console.log('Logout error:', error);
        } finally {
            dispatch(onLogout());
        }
    }



    return {
        //* Propiedades
        errorMessage,
        status,
        user,

        //* Métodos
        checkAuthToken,
        startLogin,
        startRegister,
        startLogout,
        getAuthUrl,
        oauthLogin,
        OAuth2Login,
        // getAllUsers,
        // getUserById
    }

}