declare global {
    namespace NodeJS {
        interface ProcessENV {
            DEVELOPMENT: boolean | string; // Used to identify development enviornments
            DISCORD_ID: string; // Application/Client ID of your Discord Bot
            DISCORD_REDIRECT: string; // Link to redirect to after OAuth2 authentication (must have this in your discord developer dashboard)
            DISCORD_GUILD: string; // Guild ID to add the members to
            DISCORD_SECRET: string; // Client Secret for your bot (in OAuth2 tab not Bot tab)
        }
    }
}

export {}