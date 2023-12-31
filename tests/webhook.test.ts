import { expect, test } from '@jest/globals';
import { executeWebhook } from '../src/webhook';
import * as inputs from '../src/models/input-definitions';
import { InputDefinition, InputType } from '../src/Input';

function input_name(name: string) {
    return `INPUT_${name.replace(/ /g, '_').toUpperCase()}`
}

function set_input<InpT extends InputType>(inp: InputDefinition<InpT>, value: any) {
    if (typeof value !== 'string') {
        if (!!value)
            value = value.toString();
    }

    process.env[input_name(inp.name)] = value;
}

function unset_input<InpT extends InputType>(inp: InputDefinition<InpT>) {
    const input_name_name = input_name(inp.name);
    if (input_name_name in process.env)
        delete process.env[input_name_name];
}

test('fails with missing URL', async () => {
    const old_val = process.env[input_name(inputs.WEBHOOK_URL.name)];
    unset_input(inputs.WEBHOOK_URL);
    await expect(executeWebhook()).rejects.toThrow('The provided webhook URL is not valid.');
    set_input(inputs.WEBHOOK_URL, old_val);
})

test("Webhook URL get returns any json response", async () => {
    const webhook_url = process.env[input_name(inputs.WEBHOOK_URL.name)];
    expect(webhook_url).toBeDefined();
    const response = await fetch(webhook_url as string);
    expect(response).toBeDefined();
});

test('Simple Send', async () => {
    set_input(inputs.CONTENT, `Test Simple Send \`${new Date().toISOString()}\``);
    set_input(inputs.USERNAME, "Test User");
    set_input(inputs.AVATAR_URL, "https://github.githubassets.com/images/modules/logos_page/Octocat.png");

    try {
        await executeWebhook();
    }
    finally {
        unset_all_inputs();
    }
})

test('Embed', async () => {
    set_input(inputs.CONTENT, `Test Embed \`${new Date().toTimeString()}\``);
    set_input(inputs.USERNAME, "Test User");
    set_input(inputs.AVATAR_URL, "https://github.githubassets.com/images/modules/logos_page/Octocat.png");

    set_input(inputs.EMBED_TITLE, "Embed Title");
    set_input(inputs.EMBED_DESCRIPTION, "Embed Description\n\nLine 4\n\nLine 6.");
    set_input(inputs.EMBED_TIMESTAMP, new Date().toISOString());
    set_input(inputs.EMBED_COLOR, "0x33b4ff");
    set_input(inputs.EMBED_AUTHOR_NAME, "Embed Name");
    set_input(inputs.EMBED_URL, "https://github.githubassets.com/assets/GitHub-Logo-ee398b662d42.png");
    set_input(inputs.EMBED_AUTHOR_ICON_URL, "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png");
    set_input(inputs.EMBED_FOOTER_TEXT, "Embed Text");

    try {
        await executeWebhook();
    }
    finally {
        unset_all_inputs();
    }
})


function unset_all_inputs() {
    // unset_input(inputs.WEBHOOK_URL);
    unset_input(inputs.CONTENT);
    unset_input(inputs.THREAD_ID);
    unset_input(inputs.THREAD_NAME);
    unset_input(inputs.FLAGS);
    unset_input(inputs.USERNAME);
    unset_input(inputs.AVATAR_URL);
    unset_input(inputs.TTS);
    unset_input(inputs.RAW_DATA);
    unset_input(inputs.RAW_STRING);
    unset_input(inputs.FILENAME);
    unset_input(inputs.EMBED_TITLE);
    unset_input(inputs.EMBED_URL);
    unset_input(inputs.EMBED_DESCRIPTION);
    unset_input(inputs.EMBED_TIMESTAMP);
    unset_input(inputs.EMBED_COLOR);
    unset_input(inputs.EMBED_FOOTER_TEXT);
    unset_input(inputs.EMBED_FOOTER_ICON_URL);
    unset_input(inputs.EMBED_IMAGE_URL);
    unset_input(inputs.EMBED_THUMBNAIL_URL);
    unset_input(inputs.EMBED_AUTHOR_NAME);
    unset_input(inputs.EMBED_AUTHOR_URL);
    unset_input(inputs.EMBED_AUTHOR_ICON_URL);
    unset_input(inputs.EMBED_FIELDS);
}