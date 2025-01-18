import os
import logging

logger = logging.getLogger(__name__)

def main():
    for subdir, _, files in os.walk("."):
        for file in files:
            name, extension = os.path.splitext(file)
            if extension == ".jpeg":
                og = os.path.join(subdir, file)
                dst = os.path.join(subdir, name + ".jpg")

                try:
                    os.rename(og, dst)
                except FileExistsError:
                    os.remove(dst)
                    os.rename(og, dst)
                    
                logger.info(f"Renamed {og} to {dst}")
                
            if extension == ".png" or extension == ".heic" or extension == ".webp":
                logger.error(f"{file} is a common image format, but not .jpeg or .jpg")
                
if __name__ == "__main__":
    main()