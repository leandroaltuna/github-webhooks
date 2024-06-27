import { Request, Response } from "express";
import { DiscordService, GitHubService } from "../services";


export class GithubController {

    constructor(
        private readonly githubService = new GitHubService(),
        private readonly discordService = new DiscordService(),
    ) {}

    webhookHandler = ( req: Request, res: Response ) => {

        const githubEvent = req.header( 'x-github-event' ) ?? 'unknown';
        // const signature = req.header( 'x-hub-signature-256' ) ?? 'unknown';
        const payload = req.body;

        let message;

        switch ( githubEvent ) {
            case 'star':
                message = this.githubService.onStar( payload );
                break;
        
            case 'issues':
                message = this.githubService.onIssue( payload );
                break;
            default:
                message = `Unkown event: ${ githubEvent }`;
                break;
        }

        this.discordService.notify( message )
            .then( () => res.status( 202 ).send( 'Accepted' ) )
            .catch( () => res.status( 500 ).json({ error: 'Internal server error' }) );

    }

}