import { workspace, window } from 'vscode';
import GraphQLClient from './GraphQLClient';

type UserStatusInput = {
    emoji: string;
    message?: string;
};

export default class GithubAPI {
    private graphClient: GraphQLClient;

    constructor() {
        this.graphClient = new GraphQLClient('https://api.github.com/graphql', {
            headers: {
                Authorization: `Bearer ${GithubAPI.getAccessToken()}`,
            },
        });
    }

    private static getAccessToken(): string | void {
        let config = workspace.getConfiguration('activityGithub');
        let accessToken: string | undefined = config.get('auth.accessToken');

        if (accessToken) {
            return accessToken;
        }

        window.showErrorMessage(
            'Github access token not found. Please use activityGithub.auth.accessToken settings to set your token.'
        );
    }

    public async changeUserStatus(newStatus: UserStatusInput) {
        const { message, emoji } = newStatus;

        return await this.graphClient.request(`
        mutation {
            changeUserStatus(input: {message: "${message}", emoji: "${emoji}"}) {
                clientMutationId
            }
        }
    `);
    }
}
