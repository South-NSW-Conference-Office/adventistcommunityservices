from PIL import Image, ImageDraw, ImageFont
import os

img = Image.open(r'D:\Adventist Community Services\frontend\public\conference-map.png').copy()
draw = ImageDraw.Draw(img)

# Try to get a nice font
font_paths = [
    r'C:\Windows\Fonts\poppins-semibold.ttf',
    r'C:\Windows\Fonts\segoeui.ttf',
    r'C:\Windows\Fonts\arial.ttf',
]
font_small = None
font_tiny = None
for fp in font_paths:
    if os.path.exists(fp):
        font_small = ImageFont.truetype(fp, 14)
        font_tiny = ImageFont.truetype(fp, 11)
        break
if not font_small:
    font_small = ImageFont.load_default()
    font_tiny = font_small

# Conference labels — positioned based on the reference map regions
# Format: (x, y, lines[], font)
labels = [
    (155, 320, ["WESTERN", "AUSTRALIAN", "CONFERENCE"], font_tiny),
    (350, 240, ["NORTHERN AUSTRALIAN CONFERENCE"], font_tiny),
    (480, 280, ["SOUTH QUEENSLAND", "CONFERENCE"], font_tiny),
    (340, 340, ["SOUTH AUSTRALIAN", "CONFERENCE"], font_tiny),
    (500, 375, ["NORTH NSW", "CONFERENCE"], font_tiny),
    (580, 460, ["GREATER SYDNEY", "CONFERENCE"], font_tiny),
    (470, 420, ["SOUTH NSW", "CONFERENCE"], font_tiny),
    (445, 510, ["VICTORIAN CONFERENCE"], font_tiny),
    (440, 580, ["TASMANIAN CONFERENCE"], font_tiny),
    (788, 350, ["NORFOLK ISLAND"], font_tiny),
]

text_color = (60, 60, 60)  # dark grey

for (x, y, lines, font) in labels:
    line_height = font.size + 2
    total_height = line_height * len(lines)
    start_y = y - total_height // 2
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
        draw.text((x - tw // 2, start_y + i * line_height), line, fill=text_color, font=font)

img.save(r'D:\Adventist Community Services\frontend\public\conference-map.png')
print("Done")
