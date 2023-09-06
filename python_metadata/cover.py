import os
from PIL import Image, ImageDraw
from colorthief import ColorThief


def get_cover_files(path, extensions=[".jpg", ".png"]):
    music_files = []
    for root, _, files in os.walk(path):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                music_files.append(os.path.join(root, file))
    return music_files


def get_colors_with_colorthief(img_path, num_colors=2):
    dir_name = os.path.dirname(img_path)
    base_name = os.path.splitext(os.path.basename(img_path))[0]
    temp_file_name = base_name + "_temp.jpg"
    temp_file = os.path.join(dir_name, temp_file_name)

    img = Image.open(img_path)
    img = img.resize((100, 100))
    img.save(temp_file)
    color_thief = ColorThief(temp_file)
    palette = color_thief.get_palette(color_count=num_colors, quality=1)
    unique_colors = list(set(palette))
    hex_colors = [
        f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}" for color in unique_colors
    ]

    os.remove(temp_file)
    return hex_colors


def create_palette_image(colors, img_width=300, color_height=50):
    img_height = color_height * len(colors)
    palette_img = Image.new("RGB", (img_width, img_height))
    draw = ImageDraw.Draw(palette_img)

    y_offset = 0
    for color in colors:
        draw.rectangle([0, y_offset, img_width, y_offset + color_height], fill=color)
        y_offset += color_height

    return palette_img


for cover in get_cover_files("./covers"):
    dominant_colors = get_colors_with_colorthief(cover, num_colors=2)
    print(cover)
    print("\t" + " - ".join(dominant_colors))

    palette_img = create_palette_image(dominant_colors)
    palette_filename = os.path.splitext(cover)[0] + "_palette.jpg"
    palette_img.save(palette_filename)
