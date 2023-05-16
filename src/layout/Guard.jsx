// Import Library
import { useSelector } from 'react-redux';

// Import Custom Library
import { getAuthData } from '@/config/store/reducer/authSlice';
import { useRouter } from 'next/router';

export default function Guard({ children }) {

    const router = useRouter();
    const authData = useSelector(getAuthData);

    if (!authData?.token) {
        router.push('/');

        return null;
    }

    return children;
}
