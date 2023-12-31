import { expect, test } from '@jest/globals';
import { executeWebhook } from '../src/webhook';
import * as inputs from '../src/inputs';

function input_name(name: string) {
    return `INPUT_${name.replace(/ /g, '_').toUpperCase()}`
}

function set_input(name: string, value: any) {
    if (typeof value !== 'string') {
        if (!!value)
            value = value.toString();
    }

    if (inputs.EMBED_KEYS.includes(name)) {
        const n_name = `embed-${name}`
        process.env[input_name(n_name)] = value;
    }

    if (inputs.EMBED_AUTHOR_KEYS.includes(name)) {
        const n_name = `embed-author-${name}`;
        process.env[input_name(n_name)] = value;
    }

    if (inputs.EMBED_FOOTER_KEYS.includes(name)) {
        const n_name = `embed-footer-${name}`;
        process.env[input_name(n_name)] = value;
    }

    if (inputs.EMBED_IMAGE_KEYS.includes(name)) {
        const n_name = `embed-image-${name}`;
        process.env[input_name(n_name)] = value;
    }

    if (inputs.EMBED_THUMBNAIL_KEYS.includes(name)) {
        const n_name = `embed-thumbnail-${name}`;
        process.env[input_name(n_name)] = value;
    }

    if (inputs.TOP_LEVEL_WEBHOOK_KEYS.includes(name)) {
        process.env[input_name(name)] = value;
    }
    else {
        process.env[input_name(name)] = value;
    }
}

function unset_input(name: string) {
    const input_name_name = input_name(name);
    if (input_name_name in process.env)
        delete process.env[input_name_name];
}

test('fails with missing URL', async () => {
    const old_val = process.env[input_name(inputs.WEBHOOK_URL)];
    unset_input(inputs.WEBHOOK_URL);
    await expect(executeWebhook()).rejects.toThrow('The provided webhook URL is not valid.');
    set_input(inputs.WEBHOOK_URL, old_val);
})

test("Webhook URL get returns any json response", async () => {
    const webhook_url = process.env[input_name(inputs.WEBHOOK_URL)];
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

    set_input(inputs.TITLE, "Embed Title");
    set_input(inputs.DESCRIPTION, "Embed Description");
    set_input(inputs.TIMESTAMP, new Date().toISOString());
    set_input(inputs.COLOR, parseInt("0x33b4ff", 16));
    set_input(inputs.NAME, "Embed Name");
    set_input(inputs.URL, "https://github.githubassets.com/assets/GitHub-Logo-ee398b662d42.png");
    set_input(inputs.ICON_URL, "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png");
    set_input(inputs.TEXT, "Embed Text");

    try {
        await executeWebhook();
    }
    finally {
        unset_all_inputs();
    }
})


function unset_all_inputs() {
    // unset_input(WEBHOOK_URL);
    unset_input(inputs.CONTENT);
    unset_input(inputs.USERNAME);
    unset_input(inputs.AVATAR_URL);
    unset_input(inputs.RAW_DATA);
    unset_input(inputs.RAW_STRING);
    unset_input(inputs.TITLE);
    unset_input(inputs.DESCRIPTION);
    unset_input(inputs.TIMESTAMP);
    unset_input(inputs.COLOR);
    unset_input(inputs.NAME);
    unset_input(inputs.URL);
    unset_input(inputs.ICON_URL);
    unset_input(inputs.TEXT);
    unset_input(inputs.FILENAME);
    unset_input(inputs.THREAD_ID);
    unset_input(inputs.THREAD_NAME);
    unset_input(inputs.FLAGS);
}