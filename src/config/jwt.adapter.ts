import { jwtDecode } from 'jwt-decode';

export class Jwt {
  
    static decodeToken<T>(token: string): T | null {
        try {
            return jwtDecode<T>(token);
        } catch (error) {
            return null;
        }
    }

    static isTokenExpired(token: string): boolean {
        try {
            const decoded = jwtDecode<{exp: number}>(token);
            if (!decoded || !decoded.exp) return true;
            
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (error) {
            return true;
        }
    }
}