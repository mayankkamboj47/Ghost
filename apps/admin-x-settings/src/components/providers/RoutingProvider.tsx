import ChangeThemeModal from '../settings/site/ThemeModal';
import DesignModal from '../settings/site/DesignModal';
import InviteUserModal from '../settings/general/InviteUserModal';
import NavigationModal from '../settings/site/NavigationModal';
import NiceModal from '@ebay/nice-modal-react';
import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {SettingsContext} from './SettingsProvider';

type RoutingContextProps = {
    route: string;
    updateRoute: (newPath: string) => void;
};

export const RouteContext = createContext<RoutingContextProps>({
    route: '',
    updateRoute: () => {}
});

function getHashPath(urlPath: string | undefined) {
    if (!urlPath) {
        return null;
    }
    const regex = /\/settings-x\/(.*)/;
    const match = urlPath?.match(regex);

    if (match) {
        const afterSettingsX = match[1];
        return afterSettingsX;
    }
    return null;
}

function handleNavigation() {
    // Get the hash from the URL
    let hash = window.location.hash;

    // Remove the leading '#' character from the hash
    hash = hash.substring(1);

    // Get the path name from the hash
    const pathName = getHashPath(hash);

    if (pathName) {
        if (pathName === 'design/edit/themes') {
            NiceModal.show(ChangeThemeModal);
        } else if (pathName === 'design/edit') {
            NiceModal.show(DesignModal);
        } else if (pathName === 'navigation/edit') {
            NiceModal.show(NavigationModal);
        } else if (pathName === 'users/invite') {
            NiceModal.show(InviteUserModal);
        }
        const element = document.getElementById(pathName);
        if (element) {
            element.scrollIntoView({behavior: 'smooth'});
        }
        return pathName;
    }
    return '';
}

type RouteProviderProps = {
    children: React.ReactNode;
};

const RoutingProvider: React.FC<RouteProviderProps> = ({children}) => {
    const [route, setRoute] = useState<string>('');

    const {settingsLoaded} = useContext(SettingsContext) || {};

    const updateRoute = useCallback((newPath: string) => {
        if (newPath) {
            window.location.hash = `/settings-x/${newPath}`;
        } else {
            window.location.hash = `/settings-x`;
        }
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            const matchedRoute = handleNavigation();
            setRoute(matchedRoute);
        };
        if (settingsLoaded) {
            const matchedRoute = handleNavigation();
            setRoute(matchedRoute);
        }

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [settingsLoaded]);

    return (
        <RouteContext.Provider value={{
            updateRoute,
            route
        }}>
            {children}
        </RouteContext.Provider>
    );
};

export default RoutingProvider;