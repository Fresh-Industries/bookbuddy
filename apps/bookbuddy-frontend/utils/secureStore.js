import * as SecureStore from 'expo-secure-store';

async function saveToken(token) {
    await SecureStore.setItemAsync('authToken', token);
}

async function getToken() {
    return await SecureStore.getItemAsync('authToken');
}

async function deleteToken() {
    await SecureStore.deleteItemAsync('authToken');
}

module.exports = {
    saveToken,
    getToken,
    deleteToken
};