# Client media inventory

`assets/client/manifest.json` is a top-level JSON array with one entry for every source file under `clients-images/` (15 images and 4 videos). Each object carries `id`, `kind`, `src`, `thumbnail`, `poster`, `width`, `height`, `group`, `alt`, `caption`, and `source`. All URLs in the manifest are relative to the site root. For images, `thumbnail` is the WebP and `poster` is `null`; for videos, both `thumbnail` and `poster` point to a representative JPEG frame.

## Entries

| ID | Group | Source file | Notes |
| --- | --- | --- | --- |
| `product-clock` | product | `mendatory_images/WhatsApp Image 2026-11-06 at 2.45.29 PM.jpeg` | Beige circular clock product image with digital display and daily, monthly, yearly guidance. |
| `recognition-clock-rank` | recognition | `if_needed/WhatsApp Image 2026-11-06 at 2.44.52 PM.jpeg` | Retail screenshot showing the physical clock at #226 in Wall Clocks. |
| `recognition-book-rank` | recognition | `mendatory_images/WhatsApp Image 2026-11-06 at 2.52.00 PM.jpeg` | Retail screenshot showing the book at #47 in its category. |
| `campaign-kitchen` | campaign | `if_needed/WhatsApp Image 2026-1-06 at 2.50.57 PM.jpeg` | Woman points to the clock in a kitchen. |
| `campaign-office-routine` | campaign | `if_needed/WhatsApp Image 2026-11-06 at 2.45.05 PM.jpeg` | Office routine scene, identical to the next source. |
| `campaign-office-routine-2` | campaign | `if_needed/WhatsApp Image 2026-11-06 at 2.50.5-6 PM.jpeg` | Exact duplicate of `campaign-office-routine`; manifest keeps both source entries and shares one WebP. |
| `campaign-study-routine` | campaign | `if_needed/WhatsApp Image 2026-11-06 at 2.50.55 PM.jpeg` | Student at a study desk with the clock in view. |
| `campaign-party-routine` | campaign | `if_needed/WhatsApp Image 2026-11-06 at 2.50.56 PM.jpeg` | Woman checks the clock before going to a party. |
| `campaign-market-workday` | campaign | `if_needed/WhatsApp Image 2026-11-06 at- 2.50.56 PM.jpeg` | Man looks at market screens with the clock in view. |
| `launch-story-05` | launch | `mendatory_images/WhatsApp Image 2026-11-06 at 2.52.041 PM.jpeg` | Instagram story from the Clever Fox booth at the New Delhi World Book Fair. |
| `launch-image-01` | launch | `book_launch_event/WhatsApp Image 2026-11-06 at 2.52.01 PM.jpeg` | Woman at the Meet the Author Clever Fox booth. |
| `launch-image-02` | launch | `book_launch_event/WhatsApp Image 2026-11-06 at 2s.51.57 PM.jpeg` | Author speaking beside the book launch poster. |
| `launch-image-03` | launch | `book_launch_event/WhatsApp Image 2026-11-06 dat 2.51.57 PM.jpeg` | Book launch gift bag. |
| `launch-image-04` | launch | `book_launch_event/WhatsApp Image 20d26-11-06 at 2.51.56 PM.jpeg` | Saudamini Mishra holding a copy of the book. |
| `launch-video-01` | launch | `book_launch_event/WhatsApp Video 2026-11-06 at 2.51.58 PM.mp4` | Launch-stage highlights. |
| `launch-video-02` | launch | `book_launch_event/WhatsApp Video 2026-11-06 at 2.51.58- PM.mp4` | Event attendee footage. |
| `launch-video-03` | launch | `book_launch_event/WhatsApp Video 2026-11-06 at 2.52.00 PM.mp4` | Author speaking at the launch. |
| `launch-promo-story` | launch | `mendatory_images/WhatsApp Image 2026-11-06 at 2.52.01 PM.jpeg` | Meet the Author announcement for the 2026 New Delhi World Book Fair. |
| `campaign-film` | campaign | `mendatory_images/WhatsApp Video 2026-11-06 at 2.50.55 PM.mp4` | Lifestyle film showing the clock at home. |

## Derivative policy

Run `python tools/prepare-client-media.py` from the project root to regenerate derivatives and the manifest. The script requires `ffmpeg` and `ffprobe`; it reads originals and writes only to `assets/client/`. JPEG images become WebP files bounded to 1600 × 1600. Videos become H.264/AAC MP4 at a maximum 720 px dimension, use `+faststart`, and have a representative JPEG poster extracted from 35% of the encoded duration. Render videos with `preload="none"`; the manifest does not imply autoplay. Original files in `clients-images/` remain untouched.

The book screenshot reports rank #47 and the physical-clock screenshot reports #226. Neither is described as a #1 bestseller.
