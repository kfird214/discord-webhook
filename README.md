# Discord Webhook

## inputs
<!-- inputs -->
| name | description | required |
| - | - | - |
| webhook-url | Webhook URL from discord. See: https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks for details | yes |
| content | Message that is sent via the webhook. | no |
| thread-id | ID of the thread you want the webhook to send the message into \(will automatically unarchive threads\) | no |
| thread-name | Name of the thread you want the webhook to create | no |
| flags | Message flags | no |
| username | The username that should appear to send the message. Note: username will have the "bot" badge next to their name. | no |
| avatar-url | URL for the avatar that should appear with the message. | no |
| tts | Boolean to indicate whether the webhook is text-to-speech | no |
| raw-data | Name of a json file that will be sent as the data for the webhook | no |
| raw-string | Content of json string that will be sent as the data for the webhook | no |
| filename | Name of a file that will be uploaded via the webhook | no |
| embed-title | Embed title | no |
| embed-url | Embed URL | no |
| embed-description | Embed description | no |
| embed-timestamp | Embed timestamp \(ISO8601 format\) | no |
| embed-color | Embed color | no |
| embed-footer-text | Embed footer text | no |
| embed-footer-icon-url | Embed footer icon url | no |
| embed-image-url | Embed image url | no |
| embed-thumbnail-url | Embed thumbnail url | no |
| embed-author-name | Embed author name | no |
| embed-author-url | Embed author url | no |
| embed-author-icon-url | Embed author icon | no |
| embed-fields | Embed fields \(custom format\)<br>  - inline field 1<br>  inline field 2<br>  . none inline field 3<br> | no |
<!-- inputs -->