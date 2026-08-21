Here is a small snippet I used today to send some files using curl. I usually use Postman to test my API, but it failed miserably to send a couple of files. Here is what I did using curl.

```sh
curl \
-X POST -H "Accept: application/json" \
-F 'attachments[]=@Chest.pdf' \
-F 'attachments[]=@Core.pdf' \
-F 'body=hello world' \
myapi.test/api/endpoint
```