import * as core from '@actions/core'
import { WebhookClient, WebhookMessageCreateOptions } from 'discord.js'
import { get_webhook_payload } from './webhook-payload'
import { RAW_DATA, RAW_STRING, WEBHOOK_URL } from './models/input-definitions';
import { get_input } from './get_input';

export async function executeWebhook() {
    let webhookUrl = core.getInput(WEBHOOK_URL.name);
    const whc = new WebhookClient({ url: webhookUrl });

    const raw_data = get_input(RAW_DATA) as WebhookMessageCreateOptions | undefined;
    if (raw_data) {
        return await whc.send(raw_data);
    }

    const raw_string = get_input(RAW_STRING) as WebhookMessageCreateOptions | undefined;
    if (raw_string) {
        return await whc.send(raw_string);
    }
    
    const payload = get_webhook_payload();
    return await whc.send(payload);
}

async function main(): Promise<void> {
    try {
        core.info('Running discord webhook action...')
        await executeWebhook()
    } catch (error) {
        // if (error instanceof Error) { 
            // core.info(error.stack ?? "NO STACK")
            // core.setFailed(error.message)
            // core.error(error)
        // }
        // else {
            // core.setFailed("Unknown error")
        // }
        core.setFailed("Unknown error")
    }
}

if (process.env.NODE_ENV !== 'test')
    main()
