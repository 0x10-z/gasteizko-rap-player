import os
import eyed3
from PIL import Image
from uuid import UUID
from mutagen.mp4 import MP4, MP4Cover
from mutagen.easyid3 import EasyID3
from mutagen.mp3 import MP3
import random
import json
import shutil
import hashlib
from random import randint
from pydub import AudioSegment
from concurrent.futures import ThreadPoolExecutor
from tqdm import tqdm
from colorthief import ColorThief
import time

OVERWRITE_MODE = None


def should_skip_file(dest_path):
    """Verifica si el archivo ya existe y si se debe saltar según la elección del usuario."""
    if os.path.exists(dest_path):
        if OVERWRITE_MODE == "n":
            return True
    return False


def set_m4a_metadata(file_path):
    """Establece metadatos en un archivo m4a si no están presentes."""
    filename_without_extension = os.path.basename(file_path).rsplit(".", 1)[0]
    audiofile = MP4(file_path)

    audiofile["©nam"] = audiofile.get("©nam", [filename_without_extension])[0]
    audiofile["©ART"] = audiofile.get("©ART", [filename_without_extension])[0]
    audiofile["©alb"] = audiofile.get("©alb", [filename_without_extension])[0]

    audiofile.save()


def copy_metadata(src_path, dest_path):
    try:
        mp3 = EasyID3(src_path)
        m4a = MP4(dest_path)
        filename_without_extension = os.path.basename(src_path).rsplit(".", 1)[0]

        m4a["\xa9nam"] = mp3.get("title", [filename_without_extension])[0]
        m4a["\xa9ART"] = mp3.get("artist", [filename_without_extension])[0]
        m4a["\xa9alb"] = mp3.get("album", [filename_without_extension])[0]

        audio = MP3(src_path)
        if audio.tags and audio.tags.getall("APIC"):
            artwork = audio.tags.getall("APIC")[0].data
            m4a["covr"] = [MP4Cover(artwork)]

        m4a.save()
    except Exception as e:
        print(f"Error copying metadata for {src_path}: {e}")


def convert_file(file_path, src_folder, dest_folder):
    filename = os.path.basename(file_path)
    relative_path = os.path.relpath(os.path.dirname(file_path), src_folder)
    dest_dir = os.path.join(dest_folder, relative_path)
    dest_path = os.path.join(dest_dir, filename.rsplit(".", 1)[0] + ".m4a")

    os.makedirs(dest_dir, exist_ok=True)

    # Si el archivo ya existe y el usuario elige saltarlo, regresar
    if should_skip_file(dest_path):
        print(f"Saltando {file_path}")
        return

    file_format = filename.rsplit(".", 1)[-1].lower()
    if file_format not in ["mp3", "m4a", "wma"]:
        print(f"Skipping unsupported format: {file_path}")
        return

    try:
        if file_format == "m4a":
            set_m4a_metadata(file_path)
            shutil.copy(file_path, dest_path)
        else:
            audio = AudioSegment.from_file(file_path, format=file_format)
            audio.export(dest_path, format="mp4")
            if file_format == "mp3":
                copy_metadata(file_path, dest_path)
    except Exception as e:
        print(f"Error processing {file_path} {dest_path}: {e}")


def convert_to_aac(src_folder, dest_folder, max_workers=4):
    all_files = [
        os.path.join(foldername, filename)
        for foldername, _, filenames in os.walk(src_folder)
        for filename in filenames
    ]

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        list(
            tqdm(
                executor.map(
                    convert_file,
                    all_files,
                    [src_folder] * len(all_files),
                    [dest_folder] * len(all_files),
                ),
                total=len(all_files),
            )
        )


def get_music_files(path, extensions=[".mp3", ".m4a"]):
    music_files = []
    for root, _, files in os.walk(path):
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


def extract_cover(file_path):
    album_folder = os.path.dirname(file_path)
    cover_path = os.path.join(album_folder, "cover.webp")

    if os.path.exists(cover_path):
        file_creation_time = os.path.getmtime(cover_path)
        current_time = time.time()
        if (
            current_time - file_creation_time
        ) <= 60:  # Si fue creado hace menos de 60 segundos
            print(f"\n[+] Cover {cover_path} already exist. Skipping...")
            return cover_path, True

    # Borrar cover.jpg si existe
    cover_jpg_path = os.path.join(album_folder, "cover.jpg")
    if os.path.exists(cover_jpg_path):
        os.remove(cover_jpg_path)

    try:
        if file_path.endswith(".mp3"):
            audiofile = eyed3.load(file_path)
            if audiofile.tag and audiofile.tag.images:
                image = audiofile.tag.images[0]
                with open(cover_path, "wb") as img_file:
                    img_file.write(image.image_data)
        elif file_path.endswith(".m4a"):
            audiofile = MP4(file_path)
            if "covr" in audiofile:
                cover_data = audiofile["covr"][0]
                with open(cover_path, "wb") as f:
                    f.write(cover_data)

        img = Image.open(cover_path)
        img_resized = img.resize((600, 600))
        img_resized.save(cover_path, format="webp", quality=100)
        print(f"\n[+] Cover saved to {cover_path}")
        return cover_path, True
    except Exception:
        print(f"\n[-] No cover found for {file_path}")
        return cover_path, False


def get_colors_with_colorthief(img_path, num_colors=2):
    dir_name = os.path.dirname(img_path)
    base_name = os.path.splitext(os.path.basename(img_path))[0]
    temp_file_name = base_name + "_temp.jpg"
    temp_file = os.path.join(dir_name, temp_file_name)

    img = Image.open(img_path)
    img = img.resize((100, 100))
    img = img.convert("RGB")
    img.save(temp_file)
    color_thief = ColorThief(temp_file)
    palette = color_thief.get_palette(color_count=num_colors, quality=1)
    unique_colors = list(set(palette))
    hex_colors = [
        f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}" for color in unique_colors
    ]

    os.remove(temp_file)
    return hex_colors


def random_color():
    """Genera un color aleatorio en formato hexadecimal."""
    return f"#{randint(0, 255):02x}{randint(0, 255):02x}{randint(0, 255):02x}"


def generate_song_list(path):
    song_files = get_music_files(path)
    songs = []
    for song_file in tqdm(song_files, desc="Processing songs", unit="song"):
        try:
            metadata = get_metadata(song_file)
            cover_path, exists = extract_cover(song_file)

            if not exists:
                cover_path = add_default_cover(song_file)

            colors = get_colors_with_colorthief(cover_path)

            # Genera el UUID a partir del hash del song_file
            hashed_song_file = hashlib.md5(song_file.encode()).hexdigest()
            song_id = UUID(hashed_song_file)
            print(cover_path)
            song = {
                "album": metadata["album"],
                "name": clean_text(metadata["title"]),
                "cover": cover_path.replace(
                    "D:/Biblioteca/Descargas/Musica_compressed",
                    # "C:/Users/iker.ocio/Downloads/Musica_compressed",
                    "https://retrogasteiz.blob.core.windows.net/gasteizkorap",
                ),
                "artist": metadata["artist"],
                "audio": song_file.replace(
                    "D:/Biblioteca/Descargas/Musica_compressed",
                    # "C:/Users/iker.ocio/Downloads/Musica_compressed",
                    "https://retrogasteiz.blob.core.windows.net/gasteizkorap",
                ),
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


def clean_text(text):
    dirty_text = [
        " - www.HHGroups.com",
        "[Producido por Ruan]",
        "4x4hh",
        "[Producido por Daniel Bum]",
    ]
    for word in dirty_text:
        text = text.replace(word, "")
    return text


def main():
    global OVERWRITE_MODE

    while True:
        print("\nMenu:")
        print("1. Convert music files to m4a and copy metadata")
        print("2. Generate tracklist from music files")
        print("3. Exit")

        choice = input("Enter your choice (1/2/3): ")

        if choice == "1":
            # Preguntar al usuario al principio si desea sobrescribir los archivos o saltarlos
            OVERWRITE_MODE = input(
                "¿Deseas sobrescribir los archivos existentes? (s/n): "
            )

            """
            The script is designed to convert audio files from one format to another, specifically from MP3 to M4A (AAC),
            while preserving the metadata (like song title, artist, album, and album cover) of the original MP3 files.
            """
            src_directory = "C:/Users/iker.ocio/Downloads/Musica"
            src_directory = "D:/Biblioteca/Descargas/Musica"
            dest_directory = "C:/Users/iker.ocio/Downloads/Musica_compressed"
            dest_directory = "D:/Biblioteca/Descargas/Musica_compressed"
            convert_to_aac(src_directory, dest_directory, max_workers=8)
            print("Conversion completed!")

        elif choice == "2":
            """
            The script is designed to process a collection of music files, extract their metadata, and generate a tracklist in JSON format.
            """
            path = "D:/Biblioteca/Descargas/Musica_compressed"
            # path = "C:/Users/iker.ocio/Downloads/Musica_compressed"
            songs = generate_song_list(path)
            with open("../src/tracklist.json", "w") as f:
                json.dump(songs, f, indent=4)
            print("Tracklist generated successfully!")

        elif choice == "3":
            print("Exiting...")
            break
        else:
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
    main()
