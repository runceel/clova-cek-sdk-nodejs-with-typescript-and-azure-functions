import { createHandler } from 'azure-function-express';
import * as clova from '@line/clova-cek-sdk-nodejs';
import express from 'express';

const skillHandler = <express.RequestHandler>clova.Client
    .configureSkill()
    .onLaunchRequest((responseHelper: clova.Context) => {
        responseHelper.setSimpleSpeech(
            clova.SpeechBuilder.createSpeechText('おはよう')
        );
    })
    .onIntentRequest((responseHelper: clova.Context) => {
        const intent = responseHelper.getIntentName();
        switch (intent) {
            case 'ThrowDiceIntent':
                responseHelper.setSimpleSpeech(
                    clova.SpeechBuilder.createSpeechText('サイコロをふるね')
                );
                break;
            default:
                responseHelper.setSimpleSpeech(
                    clova.SpeechBuilder.createSpeechText('何かインテントが来たよ')
                );
                break;
        }
    })
    .onSessionEndedRequest((responseHelper: clova.Context) => {
        // do something on session end
    })
    .handle();

const app = express();
const clovaMiddleware = clova.Middleware({ applicationId: "jp.okazuki.clova.diceskill" });
app.post('/api/clova',
    (req, res, next) => {
        req.body = (<any>req).rawBody; // Clova のミドルウェアを azure-function-express で動かすためのおまじない
        next();
    },
    clovaMiddleware,
    skillHandler);

export = createHandler(app);
