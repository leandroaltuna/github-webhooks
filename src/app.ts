import express from 'express';
import { envs } from './config';
import { GithubController } from './presentation/github/controller';
import { GitHubSha256Middleware } from './presentation/middlewares/github-sha256.middleware';


(() => {

    main();

}) ();


function main() {

    const app = express();
    
    const githubController = new GithubController();

    app.use( express.json() );
    app.use( GitHubSha256Middleware.verifySignature );

    app.post( '/api/github', githubController.webhookHandler );

    app.listen( envs.PORT, () => {
        console.log( `App runing in port ${ envs.PORT }` );
    });

}