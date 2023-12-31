import { WebhookMessageCreateOptions, MessageFlags, APIEmbed, EmbedBuilder, APIEmbedField } from 'discord.js';
import { get_input } from './get_input';
import * as inputs from './models/input-definitions';

const DESCRIPTION_LIMIT = 4096;

function clip_text(text: string, limit: number, clip_text: string = "..."): string {
    const clip_len = clip_text.length;

    if (text.length > limit) {
        return text.substring(0, limit - clip_len) + clip_text;
    }

    return text;
}

export function get_webhook_payload(): WebhookMessageCreateOptions {
    const file = get_input(inputs.FILENAME);

    const message_flags = get_input(inputs.FLAGS);

    let flags: WebhookMessageCreateOptions["flags"] | undefined = undefined;
    if (message_flags) {
        if (message_flags == "SuppressEmbeds" || message_flags == "SuppressNotifications") {
            flags = message_flags;
        }
        else {
            try {
                const msgNumber = parseInt(message_flags);
                if (msgNumber == MessageFlags.SuppressEmbeds || msgNumber == MessageFlags.SuppressNotifications) {
                    flags = msgNumber;
                }
            } catch {
                console.warn(`Invalid message flag: ${message_flags}`);
            }
        }
    }

    let _eb: EmbedBuilder | undefined = undefined;
    function eb(): EmbedBuilder {
        if (!_eb) {
            _eb = new EmbedBuilder();
        }

        return _eb;
    }

    const color = get_input(inputs.EMBED_COLOR);
    if (color) {
        eb().setColor(color);
    }

    const title = get_input(inputs.EMBED_TITLE);
    if (title) {
        eb().setTitle(clip_text(title, 256));
    }

    const description = get_input(inputs.EMBED_DESCRIPTION);
    if (description) {
        eb().setDescription(clip_text(description, DESCRIPTION_LIMIT));
    }

    const url = get_input(inputs.EMBED_URL);
    if (url) {
        eb().setURL(url);
    }

    const timestamp = get_input(inputs.EMBED_TIMESTAMP);
    if (timestamp) {
        eb().setTimestamp(timestamp);
    }

    const footer_text = get_input(inputs.EMBED_FOOTER_TEXT);
    const footer_icon_url = get_input(inputs.EMBED_FOOTER_ICON_URL);
    if (footer_text) {
        eb().setFooter({
            text: clip_text(footer_text, 2048),
            iconURL: footer_icon_url,
        });
    }

    const image_url = get_input(inputs.EMBED_IMAGE_URL);
    if (image_url) {
        eb().setImage(image_url);
    }

    const thumbnail_url = get_input(inputs.EMBED_THUMBNAIL_URL);
    if (thumbnail_url) {
        eb().setThumbnail(thumbnail_url);
    }

    const author_name = get_input(inputs.EMBED_AUTHOR_NAME);
    const author_url = get_input(inputs.EMBED_AUTHOR_URL);
    const author_icon_url = get_input(inputs.EMBED_AUTHOR_ICON_URL);
    if (author_name) {
        eb().setAuthor({
            name: clip_text(author_name, 256),
            url: author_url,
            iconURL: author_icon_url,
        });
    }

    const FIELD_KEY_VALUE_SEPERATOR = "=";
    const fields_str = get_input(inputs.EMBED_FIELDS) as string;
    if (fields_str) {
        const fields_arr = fields_str.split('\n').filter(x => x.length > 0);
        const fields: APIEmbedField[] = fields_arr.map(x => {
            const [inline_and_name, value] = x.split(FIELD_KEY_VALUE_SEPERATOR);

            let name = inline_and_name;

            let inline = false;
            if (inline_and_name.startsWith('-')) {
                inline = true;
                name = name.substring(1);
            }
            else if (inline_and_name.startsWith('.')) {
                inline = false;
                name = name.substring(1);
            }

            name = name.trim();

            return {
                name: clip_text(name, 256),
                value: clip_text(value.trim(), 1024),
                inline
            } as APIEmbedField;
        }).filter(x => x.name.length > 0 && x.value.length > 0);

        eb().addFields(fields);
    }

    const embeds = !_eb ? undefined : [_eb];

    const payload: WebhookMessageCreateOptions = {
        username: get_input(inputs.USERNAME),
        avatarURL: get_input(inputs.AVATAR_URL),

        content: get_input(inputs.CONTENT),

        files: !file ? undefined : [file],
        flags: flags,

        threadId: get_input(inputs.THREAD_ID),
        threadName: get_input(inputs.THREAD_NAME),

        tts: get_input(inputs.TTS),

        embeds,
    };

    return payload;
}