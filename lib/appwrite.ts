import { Account, Avatars, Client, OAuthProvider } from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
export const config = {
  platform: "com.mohdajlal.realestate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  project: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.project!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);

export const account = new Account(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );

    if (!response) {
      throw new Error("Failed to login");
    }

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );

    if (browserResult.type != "success") {
        throw new Error("Failed to login");
    }

    const url = new URL(browserResult.url)

    const secret = url.searchParams.get("secret")?.toString()

    const userId = url.searchParams.get("userId")?.toString()

    if(!secret || !userId){
      throw new Error("Failed to login")
    }

    const session = await account.createSession(userId, secret)

    if(!session){
      throw new Error("Failed to create a session")
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}


export async function logout() {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}


export async function getUser() {
  try {
    const user = await account.get();

    if (user.$id) {
        const userAvatar = avatar.getInitials(user.name)
        return {
            ...user,
            avatar: userAvatar.toString()
        };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}