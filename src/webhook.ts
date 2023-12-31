import * as core from '@actions/core'
import * as inputs from './inputs'
import { readFileSync } from 'fs'
import { WebhookClient } from 'discord.js'

const DESCRIPTION_LIMIT = 4096

function createPayload(): Record<string, unknown> {
    // If raw-data provided, load the file and ignore the other parameters
    const rawData = core.getInput(inputs.RAW_DATA)
    if (rawData.length > 0) {
        return JSON.parse(readFileSync(rawData, 'utf-8'))
    }

    const stringData = core.getInput(inputs.RAW_STRING);
    if (stringData.length > 0) {
        return JSON.parse(stringData);
    }

    const webhookPayloadMap = parseMapFromParameters(inputs.TOP_LEVEL_WEBHOOK_KEYS)
    const embedPayloadMap = createEmbedObject()
    if (embedPayloadMap.size > 0) {
        webhookPayloadMap.set('embeds', [Object.fromEntries(embedPayloadMap)])
    }
    const webhookPayload = Object.fromEntries(webhookPayloadMap)
    core.info(JSON.stringify(webhookPayload))
    return webhookPayload
}

function createEmbedObject(): Map<string, unknown> {
    const embedPayloadMap = parseMapFromParameters(inputs.EMBED_KEYS, 'embed')

    if (embedPayloadMap.size > 0) {
        const embedAuthorMap = parseMapFromParameters(
            inputs.EMBED_AUTHOR_KEYS,
            'embed-author'
        )
        if (embedAuthorMap.size > 0) {
            embedPayloadMap.set('author', Object.fromEntries(embedAuthorMap))
        }
        const embedFooterMap = parseMapFromParameters(
            inputs.EMBED_FOOTER_KEYS,
            'embed-footer'
        )
        if (embedFooterMap.size > 0) {
            embedPayloadMap.set('footer', Object.fromEntries(embedFooterMap))
        }
        const embedImageMap = parseMapFromParameters(
            inputs.EMBED_IMAGE_KEYS,
            'embed-image'
        )
        if (embedImageMap.size > 0) {
            embedPayloadMap.set('image', Object.fromEntries(embedImageMap))
        }
        const embedThumbnailMap = parseMapFromParameters(
            inputs.EMBED_THUMBNAIL_KEYS,
            'embed-thumbnail'
        )
        if (embedThumbnailMap.size > 0) {
            embedPayloadMap.set('thumbnail', Object.fromEntries(embedThumbnailMap))
        }
    }

    return embedPayloadMap
}

function parseMapFromParameters(
    parameters: string[],
    inputObjectKey = ''
): Map<string, unknown> {
    // Parse action inputs into discord webhook execute payload
    const parameterMap = new Map<string, unknown>()
    core.info(`inputObjectKey: ${inputObjectKey}`)

    for (const parameter of parameters) {
        const inputKey =
            inputObjectKey !== '' ? `${inputObjectKey}-${parameter}` : parameter
        let value = core.getInput(inputKey)
        if (value === '') {
            continue
        }

        if (parameter === inputs.TIMESTAMP) {
            const parsedDate = new Date(value)
            value = parsedDate.toISOString()
        }

        if (parameter === inputs.DESCRIPTION) {
            if (value.length > DESCRIPTION_LIMIT) {
                value = value.substring(0, DESCRIPTION_LIMIT)
            }
        }

        core.info(`${inputKey}: ${value}`)
        if (value.length > 0) parameterMap.set(parameter.replace('-', '_'), value)
    }

    return parameterMap
}

export async function executeWebhook() {
    let webhookUrl = core.getInput(inputs.WEBHOOK_URL)
    const filename = core.getInput(inputs.FILENAME)
    const threadId = core.getInput(inputs.THREAD_ID)
    const threadName = core.getInput(inputs.THREAD_NAME)
    const flags = core.getInput(inputs.FLAGS)
    const payload = createPayload()

    if (threadId !== '') {
        webhookUrl = `${webhookUrl}?thread_id=${threadId}`
    }

    const whc = new WebhookClient({ url: webhookUrl });
    return await whc.send(payload);
}

async function main(): Promise<void> {
    try {
        core.info('Running discord webhook action...')
        await executeWebhook()
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

if (process.env.NODE_ENV !== 'test')
    main()
