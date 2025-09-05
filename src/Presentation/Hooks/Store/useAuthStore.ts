import { useDispatch } from 'react-redux';
import { clearErrorMessage, onChecking, onLogin, onLogout } from '../../Store';
import { InventoryBackend } from '../../Api/Index';
import { useAppSelector } from '..';
import { Jwt } from '../../../config';
import type { SignInFormDataInterface, SignUpFormDataInterface } from '../../../Interface/interfaces';
import type { AxiosError } from 'axios';


export const useAuthStore = () => {

    const { status, user, errorMessage } = useAppSelector( state => state.auth );
    const dispatch = useDispatch();
 
    const isValidToken = (token: string) => {
        if (!token) return dispatch( onLogout() );
        if (Jwt.isTokenExpired(token)) {
            localStorage.clear();
            dispatch(onLogout());
        }
    };

    const startLogin = async({ email, password }:SignInFormDataInterface) => {
        dispatch( onChecking() );
        try {
            const { data } = await InventoryBackend.post('/auth/login',{ email, password });
            localStorage.setItem('token', data.token );
            localStorage.setItem("token-init-date", new Date().getTime().toString());
            dispatch( onLogin({ ...data.user }) );
            
        } catch (error: unknown) {
            const err = error as AxiosError<any>
            dispatch( onLogout(err.response?.data.error));
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 3000);
        }
    }
    const startRegister = async({ username, firstName, lastName,email, password }:SignUpFormDataInterface) => {
        dispatch( onChecking() );
        try {
            const { data } = await InventoryBackend.post('/auth/register',{ username, firstName, lastName, email, password, role:1});
            localStorage.setItem('token', data.token );
            localStorage.setItem("token-init-date", new Date().getTime().toString());
            
            dispatch( onLogin({ username: data.user.username, email: data.user.email }) );
            
        } catch (error: unknown) {
            const err = error as AxiosError<any>
            dispatch( onLogout(err.response?.data.error));
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 3000);
        }
    }

    const OAuth2Login = async() => {
        dispatch( onChecking() );
        try {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");
            console.log(`Code ${code}`)
            const { data } = await InventoryBackend.get('/auth/google');
            localStorage.setItem('token', data.token );
            localStorage.setItem("token-init-date", new Date().getTime().toString());
            dispatch( onLogin({ username: data.user.username, email: data.user.email }) );
            
        } catch (error) {
            dispatch( onLogout('Invalid Credentials') );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }

    const oauthLogin = async({ email }:SignInFormDataInterface) => {
        dispatch( onChecking() );
        try {
            const { data } = await InventoryBackend.post('/auth/oauth',{ email });
            localStorage.setItem('token', data.token );
            localStorage.setItem("token-init-date", new Date().getTime().toString());
            dispatch( onLogin({ username: data.user.username, email: data.user.email }) );
            
        } catch (error) {
            dispatch( onLogout('Invalid Credentials') );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }


    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if ( !token ) return dispatch( onLogout() );
        if (Jwt.isTokenExpired(token)) return startLogout();

        try {
            const { data } = await InventoryBackend.get('auth/renew',{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!isValidToken(data.token)) return dispatch( onLogout() );
            
            localStorage.setItem('token', data.token );
            localStorage.setItem("token-init-date", new Date().getTime().toString());

            // Decode token to get user info
            const decodedToken = Jwt.decodeToken<{username: string, email: string}>(data.token);
            if (decodedToken) {
                dispatch( onLogin({ username: decodedToken.username, email: decodedToken.email }) );
            } else {
                localStorage.clear();
                dispatch( onLogout() );
            }

        } catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        }
    }

    const getAuthUrl = () => {
  window.location.href = 'http://localhost:3000/api/auth/google'; // Or whatever your backend route is
};

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogout());
    }

    const getAllUsers = async(page: number = 1, limit: number = 10) => {
        const token = localStorage.getItem('token');
        if (!isValidToken(token!)) return null;

        try {
            const { data } = await InventoryBackend.get(`/api/users/findAll?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return data;
        } catch (error) {
            const err = error as AxiosError<any>;
            throw err.response?.data.error || 'Error fetching users';
        }
    }

    const getUserById = async(uuid: string) => {
        const token = localStorage.getItem('token');
        if (!isValidToken(token!)) return null;

        try {
            const { data } = await InventoryBackend.get(`/users/find/${uuid}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return data;
        } catch (error) {
            const err = error as AxiosError<any>;
            throw err.response?.data.error || 'Error fetching user';
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
        getAllUsers,
        getUserById
    }

}