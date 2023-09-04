import os
from pydub import AudioSegment
from concurrent.futures import ThreadPoolExecutor
from tqdm import tqdm
from mutagen.easyid3 import EasyID3
from mutagen.mp4 import MP4, MP4Cover
from mutagen.mp3 import MP3
import shutil


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
        print(f"Error processing {file_path}: {e}")


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
if __name__ == "__main__":
    src_directory = "C:/Users/iker.ocio/Downloads/Musica"
    dest_directory = "C:/Users/iker.ocio/Downloads/Musica_compressed"
    convert_to_aac(src_directory, dest_directory, max_workers=8)
