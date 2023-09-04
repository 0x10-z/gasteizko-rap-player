import os
from pydub import AudioSegment
from concurrent.futures import ThreadPoolExecutor
from tqdm import tqdm
from mutagen.easyid3 import EasyID3
from mutagen.mp4 import MP4, MP4Cover
from mutagen.mp3 import MP3


def copy_metadata(src_path, dest_path):
    try:
        mp3 = EasyID3(src_path)
        m4a = MP4(dest_path)
        filename_without_extension = os.path.basename(src_path).rsplit(".", 1)[0]

        # Copiar metadatos básicos
        if "title" in mp3:
            m4a["\xa9nam"] = mp3["title"][0]
        else:
            m4a["\xa9nam"] = filename_without_extension

        if "artist" in mp3:
            m4a["\xa9ART"] = mp3["artist"][0]
        else:
            m4a["\xa9ART"] = filename_without_extension

        if "album" in mp3:
            m4a["\xa9alb"] = mp3["album"][0]
        else:
            m4a["\xa9alb"] = filename_without_extension

        # Copiar carátula si está presente
        audio = MP3(src_path)
        if audio.tags and audio.tags.getall("APIC"):
            artwork = audio.tags.getall("APIC")[0].data
            m4a["covr"] = [MP4Cover(artwork)]
        else:
            pass

        m4a.save()
    except Exception as e:
        print(f"Error copying metadata for {src_path}: {e}")


def convert_file(file_path, src_folder, dest_folder):
    filename = os.path.basename(file_path)

    # Cambiar la extensión a .aac y construir la ruta de destino
    relative_path = os.path.relpath(os.path.dirname(file_path), src_folder)
    dest_dir = os.path.join(dest_folder, relative_path)
    dest_path = os.path.join(dest_dir, filename.rsplit(".", 1)[0] + ".m4a")

    # Crear subdirectorios en dest_folder si no existen
    try:
        os.makedirs(dest_dir)
    except FileExistsError:
        pass

    # Determinar el formato del archivo basado en su extensión
    file_format = filename.rsplit(".", 1)[-1].lower()
    if file_format not in ["mp3", "m4a", "wma"]:
        print(f"Skipping unsupported format: {file_path}")
        return

    # Convertir el archivo a AAC
    try:
        audio = AudioSegment.from_file(file_path, format=file_format)
        audio.export(dest_path, format="mp4")
        if file_format == "mp3":
            copy_metadata(file_path, dest_path)
    except Exception as e:
        print(f"Error converting {file_path}: {e}")


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


"""
The script is designed to convert audio files from one format to another, specifically from MP3 to M4A (AAC),
while preserving the metadata (like song title, artist, album, and album cover) of the original MP3 files.
"""
src_directory = "C:/Users/iker.ocio/Downloads/Musica"
dest_directory = "C:/Users/iker.ocio/Downloads/Musica_compressed"
convert_to_aac(src_directory, dest_directory)
