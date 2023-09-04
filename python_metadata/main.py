import os
import eyed3
from PIL import Image
from uuid import uuid4
from mutagen.easyid3 import EasyID3
from mutagen.mp4 import MP4, MP4Cover
import random
from tqdm import tqdm
import json
import shutil
import hashlib
from uuid import UUID


def get_music_files(path, extensions=[".mp3", ".m4a"]):
    music_files = []
    for root, dirs, files in os.walk(path):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                music_files.append(os.path.join(root, file))
    return music_files


def get_metadata(file_path):
    album_name = os.path.basename(os.path.dirname(file_path))

    try:
        if file_path.endswith(".mp3"):
            audiofile = eyed3.load(file_path)
            if audiofile and audiofile.tag:
                title = audiofile.tag.title if audiofile.tag.title else "Unknown Title"
                artist = (
                    audiofile.tag.artist if audiofile.tag.artist else "Unknown Artist"
                )
                return {"title": title, "artist": artist, "album": album_name}
        elif file_path.endswith(".m4a"):
            audiofile = MP4(file_path)
            title = audiofile.get("©nam", ["Unknown Title"])[0]
            artist = audiofile.get("©ART", ["Unknown Artist"])[0]
            return {"title": title, "artist": artist, "album": album_name}

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

    return {"title": "Unknown Title", "artist": "Unknown Artist", "album": album_name}


def save_cover_from_m4a(file_path):
    album_folder = os.path.dirname(file_path)
    cover_path = os.path.join(album_folder, "cover.jpg")
    exists = True
    if not os.path.exists(cover_path):
        audiofile = MP4(file_path)

        if "covr" in audiofile:
            cover_data = audiofile["covr"][0]
            cover_path = os.path.join(os.path.dirname(file_path), "cover.jpg")
            with open(cover_path, "wb") as f:
                f.write(cover_data)

            print(f"Cover saved to {cover_path}")
        else:
            exists = False
            print(f"No cover found for {file_path}")
    return cover_path, exists


def extract_cover_from_mp3(mp3_file_path):
    album_folder = os.path.dirname(mp3_file_path)
    cover_path = os.path.join(album_folder, "cover.jpg")
    exists = True
    if not os.path.exists(cover_path):
        # Cargar el archivo MP3 con eyed3
        audiofile = eyed3.load(mp3_file_path)

        # Verificar si el archivo tiene etiquetas y una carátula
        if audiofile.tag and audiofile.tag.images:
            # Tomar la primera imagen (generalmente es la carátula del álbum)
            image = audiofile.tag.images[0]

            # Guardar la carátula en la carpeta del álbum
            with open(cover_path, "wb") as img_file:
                img_file.write(image.image_data)

            print(f"Cover saved to {cover_path}")
        else:
            exists = False
            print(f"No cover found for {mp3_file_path}")
    return cover_path, exists


def get_dominant_colors(img_path, num_colors=2):
    img = Image.open(img_path).convert("RGB")  # Convertir la imagen a RGB
    img = img.resize((25, 25), reducing_gap=2.0)
    result = img.convert("P", palette=Image.ADAPTIVE, colors=num_colors)
    result.putalpha(0)
    main_colors = result.getcolors()

    # Si main_colors tiene menos colores de los esperados, elige un color aleatorio y agrégalo
    while len(main_colors) < num_colors:
        main_colors.append(random.choice(main_colors))

    # Convertir los colores a formato hexadecimal
    hex_colors = []
    for color in main_colors:
        if len(color[1]) == 3:  # Si es RGB
            hex_colors.append(f"#{color[1][0]:02x}{color[1][1]:02x}{color[1][2]:02x}")
        else:  # Si no es RGB, usar un color por defecto (puedes cambiarlo)
            hex_colors.append(random_color())

    return hex_colors


from random import randint


def random_color():
    """Genera un color aleatorio en formato hexadecimal."""
    return f"#{randint(0, 255):02x}{randint(0, 255):02x}{randint(0, 255):02x}"


def generate_song_list(path):
    song_files = get_music_files(path)
    songs = []
    for song_file in tqdm(song_files, desc="Processing songs", unit="song"):
        try:
            metadata = get_metadata(song_file)
            if song_file.endswith(".m4a"):
                cover_path, exists = save_cover_from_m4a(song_file)
            else:
                cover_path, exists = extract_cover_from_mp3(song_file)

            if not exists:
                cover_path = add_default_cover(song_file)

            colors = get_dominant_colors(cover_path)

            # Genera el UUID a partir del hash del song_file
            hashed_song_file = hashlib.md5(song_file.encode()).hexdigest()
            song_id = UUID(hashed_song_file)

            song = {
                "album": metadata["album"],
                "name": metadata["title"],
                "cover": cover_path,
                "artist": metadata["artist"],
                "audio": song_file,
                "color": colors,
                "id": str(song_id),
                "active": False,
            }
            songs.append(song)
        except Exception as e:
            print(f"Error processing {song_file}: {e}")
    return songs


def add_default_cover(mp3_file_path):
    album_folder = os.path.dirname(mp3_file_path)
    cover_path = os.path.join(album_folder, "cover.jpg")
    shutil.copy("./covers/no cover.png", cover_path)

    return cover_path


def replace_paths(songs):
    for song in songs:
        song["audio"] = song["audio"].replace(
            # "/mnt/d/Biblioteca/Descargas/Rap Vitoria/",
            "C:/Users/iker.ocio/Downloads/Musica_compressed",
            "https://retrogasteiz.blob.core.windows.net/gasteizkorap",
        )
        song["cover"] = song["cover"].replace(
            # "/mnt/d/Biblioteca/Descargas/Rap Vitoria/",
            "C:/Users/iker.ocio/Downloads/Musica_compressed",
            "https://retrogasteiz.blob.core.windows.net/gasteizkorap",
        )
    return songs


if __name__ == "__main__":
    path = "/mnt/d/Biblioteca/Descargas/Rap Vitoria"
    path = "C:/Users/iker.ocio/Downloads/Musica_compressed"
    songs = generate_song_list(path)
    songs = replace_paths(songs)
    with open("../src/tracklist.json", "w") as f:
        json.dump(songs, f, indent=4)
    print("Tracklist generated successfully!")
