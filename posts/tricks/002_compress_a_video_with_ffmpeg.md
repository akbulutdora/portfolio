Here is the chain of commands I used to reduce the size of a video on my mac. I asked claude, so maybe there is room for improvement. It's funny how you can't do this with the export options of macos.

get video info:
```
ffprobe "video.mov"
```

get video original size:
```
ls -lh "video.mov"
```

compress:
```
ffmpeg -i "video.mov" -vf "scale=1280:720" -r 30 -c:v libx264 -crf 28 -c:a aac -b:a 96k "video_compressed.mov"
```

breakdown of the parameters:
```
-i: Input file
-vf "scale=1280:720": Resize to 720p
-r 30: Reduce frame rate to 30fps
-c:v libx264: Use H.264 video codec
-crf 28: Constant Rate Factor 28 (range is 0-51, lower is better quality, 18-28 is usually good)
-c:a aac: Use AAC audio codec
-b:a 96k: Audio bitrate 96kbps
```

How it could be better:
1. For screencasts with text, we could use a lower CRF (maybe 23-25) and try these additional options:
```
ffmpeg -i input.mov -vf "scale=1280:720" -r 30 -c:v libx264 -crf 23 -preset slower -tune stillimage -c:a aac -b:a 96k output.mov
```

breakdown:
```
-preset slower: Better compression at the cost of encoding time
-tune stillimage: Optimized for screencast-type content
```

2. Or if you want to maintain even better text quality while still getting good compression:
```
ffmpeg -i input.mov -vf "scale=1280:720" -r 30 -c:v libx264 -crf 20 -preset veryslow -tune stillimage -profile:v high -c:a aac -b:a 96k output.mov
```

This would produce a larger file (probably 3-5MB) but with noticeably better text quality.

The reason my original command produced such a small file (912KB) with still-readable quality is that H.264 is particularly good at compressing screen recordings, especially when there's limited motion. The macOS export feature uses more generic settings that don't take advantage of these optimization opportunities.