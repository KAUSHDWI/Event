import { Client, Account, ID, Avatars, Databases, Query } from 'appwrite';
import 'react-native-url-polyfill/auto';

export const appwriteConfig = {
    endpoint: 'https://nyc.cloud.appwrite.io/v1',
    projectId: '693d160f0039469c3f60',
    databaseId: '693d1835001b61c889a3', 
    userCollectionId: 'event', // Ensure this is the ID, not just the name!
    eventCollectionId: 'events', // ⚠️ You need to create this collection for events
    bookingCollectionId: 'bookings', // ⚠️ You need to create this collection for bookings
};

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// ==========================================
// 🔐 AUTHENTICATION FUNCTIONS
// ==========================================

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username);
        if (!newAccount) throw Error;

        await signIn(email, password);

        const avatarUrl = avatars.getInitials(username);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl
            }
        );

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

export const signIn = async (email, password) => {
    try {
        try { await account.deleteSession('current'); } catch (e) {}
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error);
    }
};

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (currentUser.documents.length === 0) return null;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const signOut = async () => {
    try {
        await account.deleteSession('current');
    } catch (error) {
        throw new Error(error);
    }
};

// ==========================================
// 📅 EVENT & BOOKING FUNCTIONS (NEW)
// ==========================================

// 1. Fetch Events (To display on Home Screen)
export const getAllPosts = async () => {
    try {
        // Try to fetch from DB
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.eventCollectionId 
        );
        return posts.documents;
    } catch (error) {
        console.log("Appwrite Error (getAllPosts):", error);
        // Return empty array if collection doesn't exist yet so app doesn't crash
        return []; 
    }
}

// 2. Book an Event (To save to DB)
export const bookEvent = async (userId, eventId, eventTitle) => {
    try {
        const booking = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.bookingCollectionId,
            ID.unique(),
            {
                user_id: userId,
                event_id: eventId,
                event_name: eventTitle,
                booked_at: new Date().toISOString()
            }
        );
        return booking;
    } catch (error) {
        console.log("Appwrite Error (bookEvent):", error);
        throw new Error(error);
    }
}